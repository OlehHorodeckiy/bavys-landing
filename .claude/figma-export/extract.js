// DOM -> Figma-ready JSON. Runs inside the live page (import() from the browser).
// Measures the untransformed layout, keeps transforms as matrices, rasterises
// photos cropped to their boxes, serialises inline SVG, and keeps text as
// styled runs so everything lands in Figma as editable layers.

const SCALE = 2;
let ORDER = 0;
const images = {};
const imgJobs = [];
const warns = [];
const xforms = new Map();

const round = (v) => Math.round(v * 100) / 100;
const px = (v) => parseFloat(v) || 0;

function colorRaw(s) {
  if (!s) return null;
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
  return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p.length > 3 ? p[3] : 1 };
}
const color = (s) => {
  const c = colorRaw(s);
  return c && c.a > 0 ? c : null;
};
const solid = (c) => ({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a });

function splitTop(str) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// ---------------------------------------------------------------- gradients

function parseStops(parts) {
  const stops = [];
  for (const part of parts) {
    const m = part.match(/^(rgba?\([^)]*\)|transparent)\s*(.*)$/);
    if (!m) continue;
    const c = colorRaw(m[1]);
    const pos = m[2].trim().split(/\s+/).filter(Boolean);
    if (!pos.length) stops.push({ c, p: null });
    for (const q of pos) stops.push({ c, p: q.endsWith('%') ? px(q) / 100 : null, raw: q });
  }
  if (!stops.length) return stops;
  if (stops[0].p == null) stops[0].p = 0;
  if (stops[stops.length - 1].p == null) stops[stops.length - 1].p = 1;
  // distribute unspecified positions
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].p != null) continue;
    let j = i;
    while (stops[j].p == null) j++;
    const a = stops[i - 1].p, b = stops[j].p;
    for (let k = i; k < j; k++) stops[k].p = a + ((b - a) * (k - i + 1)) / (j - i + 1);
  }
  // transparent stops borrow the neighbour's rgb (CSS interpolates premultiplied)
  for (let i = 0; i < stops.length; i++) {
    if (stops[i].c.a > 0) continue;
    const n = stops[i + 1] && stops[i + 1].c.a > 0 ? stops[i + 1] : stops[i - 1];
    if (n) stops[i].c = { ...n.c, a: 0 };
  }
  return stops.map((s) => ({ position: Math.min(1, Math.max(0, s.p)), color: { r: s.c.r, g: s.c.g, b: s.c.b, a: s.c.a } }));
}

function inv2(M, off) {
  const [[a, b], [c, d]] = M;
  const det = a * d - b * c;
  const i00 = d / det, i01 = -b / det, i10 = -c / det, i11 = a / det;
  return [
    [i00, i01, -(i00 * off[0] + i01 * off[1])],
    [i10, i11, -(i10 * off[0] + i11 * off[1])],
  ];
}

function linearPaint(args, W, H) {
  let parts = splitTop(args);
  let deg = 180;
  const first = parts[0];
  if (/deg|turn|rad|^to\s/.test(first)) {
    parts = parts.slice(1);
    if (first.startsWith('to ')) {
      const t = first.slice(3);
      const map = { top: 0, right: 90, bottom: 180, left: 270, 'top right': 45, 'right top': 45, 'bottom right': 135, 'right bottom': 135, 'bottom left': 225, 'left bottom': 225, 'top left': 315, 'left top': 315 };
      deg = map[t] ?? 180;
    } else if (first.endsWith('turn')) deg = px(first) * 360;
    else if (first.endsWith('rad')) deg = (px(first) * 180) / Math.PI;
    else deg = px(first);
  }
  const th = (deg * Math.PI) / 180;
  const dir = [Math.sin(th), -Math.cos(th)];
  const L = Math.abs(W * Math.sin(th)) + Math.abs(H * Math.cos(th));
  const S = [(W / 2 - (dir[0] * L) / 2) / W, (H / 2 - (dir[1] * L) / 2) / H];
  const E = [(W / 2 + (dir[0] * L) / 2) / W, (H / 2 + (dir[1] * L) / 2) / H];
  const d = [E[0] - S[0], E[1] - S[1]];
  const q = [(-d[1] * H) / W, (d[0] * W) / H];
  const T = inv2([[d[0], q[0]], [d[1], q[1]]], [S[0] - 0.5 * q[0], S[1] - 0.5 * q[1]]);
  return { type: 'GRADIENT_LINEAR', gradientTransform: T, gradientStops: parseStops(parts) };
}

function lenOf(tok, ref) {
  if (tok.endsWith('%')) return (px(tok) / 100) * ref;
  return px(tok);
}
function posOf(tok, ref) {
  const k = { left: 0, top: 0, center: 50, right: 100, bottom: 100 };
  if (tok in k) return (k[tok] / 100) * ref;
  return lenOf(tok, ref);
}

function radialPaint(args, W, H) {
  let parts = splitTop(args);
  let shape = 'ellipse', size = [], cx = W / 2, cy = H / 2, kw = 'farthest-corner';
  const first = parts[0];
  if (!/^(rgba?\(|transparent)/.test(first)) {
    parts = parts.slice(1);
    const [sp, pp] = first.split(/\s+at\s+/);
    for (const t of (sp || '').trim().split(/\s+/).filter(Boolean)) {
      if (t === 'circle' || t === 'ellipse') shape = t;
      else if (/side|corner/.test(t)) kw = t;
      else size.push(t);
    }
    if (pp) {
      const p = pp.trim().split(/\s+/);
      cx = posOf(p[0], W);
      cy = posOf(p[1] ?? 'center', H);
    }
  }
  let rx, ry;
  if (size.length === 2) { rx = lenOf(size[0], W); ry = lenOf(size[1], H); }
  else if (size.length === 1) { rx = ry = lenOf(size[0], W); }
  else {
    const fx = Math.max(cx, W - cx), fy = Math.max(cy, H - cy);
    const nx = Math.min(cx, W - cx), ny = Math.min(cy, H - cy);
    if (shape === 'circle') {
      const far = Math.hypot(fx, fy), near = Math.min(nx, ny);
      rx = ry = kw === 'closest-side' ? near : kw === 'farthest-side' ? Math.max(fx, fy) : kw === 'closest-corner' ? Math.hypot(nx, ny) : far;
    } else if (kw === 'closest-side') { rx = nx; ry = ny; }
    else if (kw === 'farthest-side') { rx = fx; ry = fy; }
    else if (kw === 'closest-corner') { rx = nx * Math.SQRT2; ry = ny * Math.SQRT2; }
    else { rx = fx * Math.SQRT2; ry = fy * Math.SQRT2; }
  }
  const rxn = rx / W, ryn = ry / H;
  const T = inv2([[2 * rxn, 0], [0, 2 * ryn]], [cx / W - rxn, cy / H - ryn]);
  return { type: 'GRADIENT_RADIAL', gradientTransform: T, gradientStops: parseStops(parts) };
}

// ---------------------------------------------------------------- images

function placement(nw, nh, W, H, fit, pos) {
  let dw = W, dh = H;
  if (fit === 'cover') { const s = Math.max(W / nw, H / nh); dw = nw * s; dh = nh * s; }
  else if (fit === 'contain') { const s = Math.min(W / nw, H / nh); dw = nw * s; dh = nh * s; }
  else if (fit === 'none') { dw = nw; dh = nh; }
  else if (fit === 'scale-down') { const s = Math.min(1, W / nw, H / nh); dw = nw * s; dh = nh * s; }
  const p = (pos || '50% 50%').split(/\s+/);
  const res = (t, free) => (t.endsWith('%') ? (free * px(t)) / 100 : px(t));
  return { dx: res(p[0], W - dw), dy: res(p[1] ?? '50%', H - dh), dw, dh };
}

function bgSize(sizeTok, nw, nh, W, H) {
  const t = sizeTok.trim();
  if (t === 'cover' || t === 'contain') return t;
  const [a, b = 'auto'] = t.split(/\s+/);
  let w = a === 'auto' ? null : lenOf(a, W);
  let h = b === 'auto' ? null : lenOf(b, H);
  if (w == null && h == null) { w = nw; h = nh; }
  else if (w == null) w = (h * nw) / nh;
  else if (h == null) h = (w * nh) / nw;
  return [w, h];
}

function queueImage(job) {
  const key = 'img' + imgJobs.length;
  imgJobs.push({ key, ...job });
  return key;
}

// A hidden browser tab may never settle decode(); fall back to onload + timeout.
function loadImage(src, ms = 8000) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    const t = setTimeout(() => (im.complete && im.naturalWidth ? resolve(im) : reject(new Error('timeout'))), ms);
    im.onload = () => { clearTimeout(t); resolve(im); };
    im.onerror = () => { clearTimeout(t); reject(new Error('load error')); };
    im.src = src;
  });
}

async function runImageJob(job) {
  const im = await loadImage(job.src);
  const nw = im.naturalWidth || job.W, nh = im.naturalHeight || job.H;
  let { W, H } = job;
  let S = SCALE;
  while (W * H * S * S > 12e6 && S > 1) S -= 0.25;
  let pl;
  if (job.bg) {
    const sz = bgSize(job.size, nw, nh, W, H);
    let dw, dh;
    if (sz === 'cover') { const s = Math.max(W / nw, H / nh); dw = nw * s; dh = nh * s; }
    else if (sz === 'contain') { const s = Math.min(W / nw, H / nh); dw = nw * s; dh = nh * s; }
    else [dw, dh] = sz;
    const p = (job.pos || '0% 0%').split(/\s+/);
    const res = (t, free) => (t.endsWith('%') ? (free * px(t)) / 100 : px(t));
    pl = { dx: res(p[0], W - dw), dy: res(p[1] ?? '50%', H - dh), dw, dh };
  } else pl = placement(nw, nh, W, H, job.fit, job.pos);
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(W * S));
  cv.height = Math.max(1, Math.round(H * S));
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(im, pl.dx * S, pl.dy * S, pl.dw * S, pl.dh * S);
  // PNG only when the photo itself has transparency or does not cover the box
  const covers = pl.dx <= 0.5 && pl.dy <= 0.5 && pl.dx + pl.dw >= W - 0.5 && pl.dy + pl.dh >= H - 0.5;
  let alpha = !covers;
  if (!alpha) {
    const sc = document.createElement('canvas');
    sc.width = 96; sc.height = 96;
    const sx = sc.getContext('2d');
    sx.drawImage(im, 0, 0, 96, 96);
    const data = sx.getImageData(0, 0, 96, 96).data;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 250) { alpha = true; break; }
  }
  images[job.key] = alpha ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.88);
}

// ---------------------------------------------------------------- svg

const SHAPES = new Set(['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'use']);
function serializeSvg(svg, W, H) {
  const clone = svg.cloneNode(true);
  const src = [svg, ...svg.querySelectorAll('*')];
  const dst = [clone, ...clone.querySelectorAll('*')];
  src.forEach((s, i) => {
    const d = dst[i];
    const tag = s.tagName.toLowerCase();
    if (SHAPES.has(tag)) {
      const cs = getComputedStyle(s);
      for (const p of ['fill', 'stroke', 'fill-opacity', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin']) {
        const v = cs.getPropertyValue(p);
        if (!v || v.startsWith('url(')) continue;
        d.setAttribute(p, v);
      }
      const sw = cs.getPropertyValue('stroke-width');
      if (sw) d.setAttribute('stroke-width', String(px(sw)));
      const op = cs.getPropertyValue('opacity');
      if (op && op !== '1') d.setAttribute('opacity', op);
      const da = cs.getPropertyValue('stroke-dasharray');
      if (da && da !== 'none') d.setAttribute('stroke-dasharray', da.replace(/px/g, ''));
    }
    d.removeAttribute('class');
    d.removeAttribute('style');
  });
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(round(W)));
  clone.setAttribute('height', String(round(H)));
  if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${round(W)} ${round(H)}`);
  return new XMLSerializer().serializeToString(clone);
}

async function svgFromUrl(url, W, H) {
  const txt = await (await fetch(url)).text();
  const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
  const root = doc.documentElement;
  if (!root.getAttribute('viewBox')) {
    const w0 = px(root.getAttribute('width')), h0 = px(root.getAttribute('height'));
    if (w0 && h0) root.setAttribute('viewBox', `0 0 ${w0} ${h0}`);
  }
  root.setAttribute('width', String(round(W)));
  root.setAttribute('height', String(round(H)));
  return new XMLSerializer().serializeToString(root);
}

// ---------------------------------------------------------------- boxes

function rectOf(el) {
  const r = el.getBoundingClientRect();
  return { x: round(r.left + scrollX), y: round(r.top + scrollY), w: round(r.width), h: round(r.height) };
}

function radiusOf(cs, w, h) {
  const one = (v, ref) => {
    const t = v.split(' ')[0];
    return t.endsWith('%') ? (px(t) / 100) * ref : px(t);
  };
  const lim = Math.min(w, h) / 2;
  const r = [
    one(cs.borderTopLeftRadius, w), one(cs.borderTopRightRadius, w),
    one(cs.borderBottomRightRadius, w), one(cs.borderBottomLeftRadius, w),
  ].map((v) => round(Math.min(v, lim)));
  return r.some((v) => v > 0) ? r : null;
}

function strokeOf(cs) {
  const sides = ['Top', 'Right', 'Bottom', 'Left'].map((s) => {
    const st = cs[`border${s}Style`];
    const w = st === 'none' || st === 'hidden' ? 0 : px(cs[`border${s}Width`]);
    return { w, c: color(cs[`border${s}Color`]), st };
  });
  const live = sides.filter((s) => s.w > 0 && s.c);
  if (!live.length) return null;
  const ref = live[0];
  const w = sides.map((s) => (s.w > 0 && s.c ? s.w : 0));
  const out = { color: { r: ref.c.r, g: ref.c.g, b: ref.c.b }, a: ref.c.a, w };
  if (ref.st === 'dashed') out.dash = [ref.w * 3, ref.w * 3];
  if (ref.st === 'dotted') out.dash = [ref.w, ref.w];
  return out;
}

function effectsOf(cs) {
  const fx = [];
  if (cs.boxShadow && cs.boxShadow !== 'none') {
    for (const sh of splitTop(cs.boxShadow)) {
      const inset = /\binset\b/.test(sh);
      const cm = sh.match(/rgba?\([^)]*\)/);
      const c = cm ? colorRaw(cm[0]) : { r: 0, g: 0, b: 0, a: 1 };
      const nums = sh.replace(/rgba?\([^)]*\)/, '').replace('inset', '').trim().split(/\s+/).map(px);
      const [ox = 0, oy = 0, blur = 0, spread = 0] = nums;
      if (!c || c.a === 0) continue;
      fx.push({ type: inset ? 'INNER_SHADOW' : 'DROP_SHADOW', color: c, offset: { x: ox, y: oy }, radius: blur, spread, visible: true, blendMode: 'NORMAL', ...(inset ? {} : { showShadowBehindNode: false }) });
    }
  }
  const bd = cs.backdropFilter || cs.webkitBackdropFilter;
  const bm = bd && bd.match(/blur\(([\d.]+)px\)/);
  if (bm) fx.push({ type: 'BACKGROUND_BLUR', radius: px(bm[1]), visible: true });
  const fm = cs.filter && cs.filter.match(/blur\(([\d.]+)px\)/);
  if (fm) fx.push({ type: 'LAYER_BLUR', radius: px(fm[1]), visible: true });
  return fx;
}

function fillsOf(el, cs, box) {
  const fills = [];
  const bc = color(cs.backgroundColor);
  if (bc) fills.push(solid(bc));
  if (cs.backgroundImage && cs.backgroundImage !== 'none') {
    const layers = splitTop(cs.backgroundImage);
    const sizes = splitTop(cs.backgroundSize);
    const poss = splitTop(cs.backgroundPosition);
    const painted = [];
    layers.forEach((L, i) => {
      const W = box.w, H = box.h;
      if (!W || !H) return;
      let m;
      if ((m = L.match(/^(?:repeating-)?linear-gradient\((.*)\)$/s))) painted.push(linearPaint(m[1], W, H));
      else if ((m = L.match(/^(?:repeating-)?radial-gradient\((.*)\)$/s))) painted.push(radialPaint(m[1], W, H));
      else if ((m = L.match(/^url\("?(.*?)"?\)$/))) {
        const key = queueImage({ src: m[1], W, H, bg: true, size: sizes[i] || sizes[0] || 'auto', pos: poss[i] || poss[0] });
        painted.push({ type: 'IMAGE', key });
      }
    });
    fills.push(...painted.reverse());
  }
  return fills;
}

// ---------------------------------------------------------------- text

const WEIGHT = (w) => +w;
function runStyle(cs) {
  const c = colorRaw(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
  const fs = px(cs.fontSize);
  const lsPx = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing);
  return {
    fs,
    fw: WEIGHT(cs.fontWeight),
    c: { r: c.r, g: c.g, b: c.b },
    a: c.a,
    ls: fs ? Math.round((lsPx / fs) * 100) : 0, // tracking in % of the size, as designers set it

    lh: cs.lineHeight === 'normal' ? null : round(px(cs.lineHeight)),
    u: /underline/.test(cs.textDecorationLine) ? 1 : 0,
    tt: cs.textTransform,
  };
}
const styleKey = (s) => [s.fs, s.fw, s.c.r, s.c.g, s.c.b, s.a, s.ls, s.lh, s.u].join('|');

function collectChars(nodes) {
  // nodes: array of Text / BR in document order
  const range = document.createRange();
  const chars = [];
  for (const n of nodes) {
    if (n.nodeType === 1) { chars.push({ br: true }); continue; }
    const cs = getComputedStyle(n.parentElement);
    const st = runStyle(cs);
    const pre = /pre/.test(cs.whiteSpace);
    for (let i = 0; i < n.data.length; i++) {
      let ch = n.data[i];
      range.setStart(n, i);
      range.setEnd(n, i + 1);
      const rs = range.getClientRects();
      if (!rs.length) continue;
      const r = rs[0];
      // collapsible whitespace only — a no-break space (U+00A0) is kept as is
      if (/[ \t\n\r\f]/.test(ch) && !pre) {
        ch = ' ';
        const prev = chars[chars.length - 1];
        if (!prev || prev.br || prev.ch === ' ') continue;
      }
      if (st.tt === 'uppercase') ch = ch.toUpperCase();
      else if (st.tt === 'lowercase') ch = ch.toLowerCase();
      chars.push({ ch, st, top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.height });
    }
  }
  // split into lines
  const lines = [];
  let cur = null;
  for (const c of chars) {
    if (c.br) { if (cur) cur.hard = true; cur = null; continue; }
    const thr = Math.max(4, c.st.fs * 0.5);
    if (!cur || (c.top - cur.top > thr && c.ch !== ' ')) {
      cur = { chars: [], top: c.top, hard: false };
      lines.push(cur);
    }
    cur.chars.push(c);
  }
  for (const L of lines) {
    while (L.chars.length && L.chars[0].ch === ' ') L.chars.shift();
    while (L.chars.length && L.chars[L.chars.length - 1].ch === ' ') L.chars.pop();
  }
  return lines.filter((L) => L.chars.length);
}

// ownsBlock: the text is the element's whole content, so its content box is the
// text box. A lone text node beside icons (flex item) uses its own line extents.
function textSpec(nodes, blockEl, ownsBlock = true) {
  const lines = collectChars(nodes);
  if (!lines.length) return null;
  const bcs = getComputedStyle(blockEl);
  const heading = /^H[1-6]$/.test(blockEl.tagName) || /balance/.test(bcs.textWrap || '');
  const nowrap = /nowrap|pre/.test(bcs.whiteSpace);
  const mode = lines.length === 1 || heading || nowrap ? 'auto' : 'fixed';
  let str = '';
  const styled = [];
  const brk = []; // soft-wrap positions, used if Figma wraps differently
  lines.forEach((L, i) => {
    if (i > 0) {
      const sep = mode === 'auto' || lines[i - 1].hard ? ' ' : ' ';
      if (sep === ' ') brk.push(str.length);
      str += sep;
      styled.push(lines[i - 1].chars[lines[i - 1].chars.length - 1].st);
    }
    for (const c of L.chars) { str += c.ch; styled.push(c.st); }
  });
  const runs = [];
  let s0 = 0;
  for (let i = 1; i <= styled.length; i++) {
    if (i === styled.length || styleKey(styled[i]) !== styleKey(styled[s0])) {
      const st = styled[s0];
      runs.push({ s: s0, e: i, fs: st.fs, fw: st.fw, c: st.c, a: st.a, ls: st.ls, lh: st.lh, u: st.u });
      s0 = i;
    }
  }
  const all = lines.flatMap((L) => L.chars);
  const left = Math.min(...all.map((c) => c.left));
  const right = Math.max(...all.map((c) => c.right));
  const f = lines[0].chars[0];
  const lh = f.st.lh || Math.round(f.st.fs * 1.15);
  const y = f.top - (lh - f.h) / 2 + scrollY;
  let x = left + scrollX;
  let w = right - left;
  if (mode === 'fixed') {
    const disp = bcs.display;
    if (ownsBlock && disp !== 'inline') {
      const r = blockEl.getBoundingClientRect();
      x = r.left + px(bcs.paddingLeft) + px(bcs.borderLeftWidth) + scrollX;
      w = r.width - px(bcs.paddingLeft) - px(bcs.paddingRight) - px(bcs.borderLeftWidth) - px(bcs.borderRightWidth);
    }
    w += 2;
  }
  const alignMap = { left: 'LEFT', start: 'LEFT', center: 'CENTER', right: 'RIGHT', end: 'RIGHT', justify: 'JUSTIFIED' };
  return {
    t: 'text', name: str.slice(0, 40), mode, x: round(x), y: round(y), w: round(w),
    align: alignMap[bcs.textAlign] || 'LEFT', lh: f.st.lh, lines: lines.length, chars: str, runs, brk,
  };
}

function isInlineTextOnly(el) {
  const cs = getComputedStyle(el);
  if (cs.display === 'none') return true;
  if (el.tagName === 'BR') return true;
  if (cs.display !== 'inline') return false;
  if (/^(IMG|SVG|svg|VIDEO|CANVAS|INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)) return false;
  for (const c of el.childNodes) if (c.nodeType === 1 && !isInlineTextOnly(c)) return false;
  return true;
}
function isTextBlock(el) {
  if (!el.textContent.trim()) return false;
  for (const c of el.childNodes) if (c.nodeType === 1 && !isInlineTextOnly(c)) return false;
  return true;
}
function textNodesOf(el) {
  const out = [];
  const walk = (n) => {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) out.push(c);
      else if (c.nodeType === 1) {
        if (c.tagName === 'BR') { out.push(c); continue; }
        if (getComputedStyle(c).display === 'none') continue;
        walk(c);
      }
    }
  };
  walk(el);
  return out;
}

// ---------------------------------------------------------------- walk

const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'HEAD', 'IFRAME', 'VIDEO', 'CANVAS', 'SOURCE']);
const SEMANTIC = new Set(['SECTION', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE', 'FIGURE', 'FORM', 'A', 'BUTTON', 'UL', 'OL', 'LI']);

function layerOf(cs, inh) {
  if (cs.position === 'static') return inh;
  const z = cs.zIndex === 'auto' ? 0 : parseInt(cs.zIndex, 10);
  if (z < 0) return -1 + z / 1000;
  return Math.max(inh, 1 + z);
}

const GENERIC = new Set(['section', 'container', 'container-wide']);
function nameOf(el) {
  const all = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
  const specific = all.filter((c) => !GENERIC.has(c) && !c.includes('--'));
  return specific[0] || all[0] || el.tagName.toLowerCase();
}

// Whole-pixel geometry for the design file: edges are rounded in page space so
// shared edges stay shared and every child offset is an integer too.
function snap(spec) {
  if (spec.t === 'text') {
    spec.x = Math.round(spec.x);
    spec.y = Math.round(spec.y);
    if (spec.w) spec.w = Math.ceil(spec.w / 2) * 2; // even text box widths
    return;
  }
  const x0 = Math.round(spec.x), y0 = Math.round(spec.y);
  const x1 = Math.round(spec.x + spec.w), y1 = Math.round(spec.y + spec.h);
  spec.x = x0; spec.y = y0; spec.w = Math.max(1, x1 - x0); spec.h = Math.max(1, y1 - y0);
  if (spec.radius) spec.radius = spec.radius.map((r) => Math.round(r));
}

function push(parent, spec, layer) {
  snap(spec);
  spec.o = ORDER++;
  spec.layer = layer;
  parent.children.push(spec);
  return spec;
}

async function walk(el, parent, inh) {
  if (SKIP.has(el.tagName)) return;
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
  const box = rectOf(el);
  const clipX = /hidden|clip|auto|scroll/.test(cs.overflowX) || /hidden|clip|auto|scroll/.test(cs.overflowY);
  if (clipX && (box.w <= 1 || box.h <= 1)) return; // visually-hidden helpers
  const xf = xforms.get(el) || null;
  if (!xf && (box.x + box.w <= 0 || box.y + box.h <= 0)) return; // parked off-screen (skip link)
  const layer = layerOf(cs, inh);
  const tag = el.tagName;

  if (tag.toLowerCase() === 'svg') {
    if (!box.w || !box.h) return;
    push(parent, { t: 'svg', name: el.getAttribute('aria-label') || nameOf(el), ...box, svg: serializeSvg(el, box.w, box.h), opacity: +cs.opacity, xf }, layer);
    return;
  }
  if (tag === 'IMG') {
    if (!box.w || !box.h) return;
    const src = el.currentSrc || el.src;
    const radius = radiusOf(cs, box.w, box.h);
    if (/\.svg(\?|$)/.test(src)) {
      push(parent, { t: 'svg', name: el.alt || 'svg', ...box, svg: await svgFromUrl(src, box.w, box.h), opacity: +cs.opacity, xf }, layer);
    } else {
      const key = queueImage({ src, W: box.w, H: box.h, fit: cs.objectFit, pos: cs.objectPosition });
      push(parent, { t: 'img', name: el.alt || 'Image', ...box, key, radius, effects: effectsOf(cs), opacity: +cs.opacity, xf }, layer);
    }
    return;
  }
  const mask = cs.maskImage || cs.webkitMaskImage;
  const mm = mask && mask.match(/url\("?(.*?\.svg)"?\)/);
  if (mm) {
    const bc = color(cs.backgroundColor);
    push(parent, { t: 'svgmask', name: nameOf(el), ...box, svg: await svgFromUrl(mm[1], box.w, box.h), color: bc, xf }, layer);
    return;
  }

  const fills = fillsOf(el, cs, box);
  const stroke = strokeOf(cs);
  const effects = effectsOf(cs);
  const visual = fills.length || stroke || effects.length;
  const stacking = cs.position !== 'static' && cs.zIndex !== 'auto';
  const wantFrame =
    visual || (clipX && el.children.length) || xf || +cs.opacity < 1 || stacking || SEMANTIC.has(tag) ||
    cs.mixBlendMode !== 'normal';

  let target = parent;
  let childInh = layer;
  const textOnly = isTextBlock(el);
  if (wantFrame && box.w > 0 && box.h > 0) {
    target = push(parent, {
      t: 'frame', name: nameOf(el), ...box, fills, stroke, effects,
      radius: radiusOf(cs, box.w, box.h), opacity: +cs.opacity < 1 ? +cs.opacity : null,
      clip: !!clipX, xf, children: [],
    }, layer);
    childInh = 0;
  }

  if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
    let txt = '', pcs = cs;
    if (tag === 'SELECT') txt = el.options[el.selectedIndex]?.text || '';
    else if (el.value) txt = el.value;
    else if (el.placeholder) { txt = el.placeholder; pcs = getComputedStyle(el, '::placeholder'); }
    if (txt && !/checkbox|radio|hidden|range/.test(el.type)) {
      const st = runStyle(pcs);
      st.fs = px(cs.fontSize); st.fw = +cs.fontWeight;
      // the field's own line height (the placeholder pseudo reports 'normal'); even fallback
      const lh = px(cs.lineHeight) || Math.round((st.fs * 1.2) / 2) * 2;
      st.lh = lh;
      const cx = box.x + px(cs.paddingLeft) + px(cs.borderLeftWidth);
      const innerH = box.h - px(cs.paddingTop) - px(cs.paddingBottom) - px(cs.borderTopWidth) - px(cs.borderBottomWidth);
      const cy = tag === 'TEXTAREA' ? box.y + px(cs.paddingTop) + px(cs.borderTopWidth) : box.y + px(cs.paddingTop) + px(cs.borderTopWidth) + (innerH - lh) / 2;
      push(target, { t: 'text', name: txt.slice(0, 40), mode: 'auto', x: round(cx), y: round(cy), w: 0, align: 'LEFT', lh, lines: 1, chars: txt, runs: [{ s: 0, e: txt.length, ...st }] }, childInh);
    }
    return;
  }

  if (textOnly) {
    const spec = textSpec(textNodesOf(el), el);
    if (spec) push(target, spec, childInh);
    return;
  }
  for (const c of el.childNodes) {
    if (c.nodeType === 1) await walk(c, target, childInh);
    else if (c.nodeType === 3 && c.data.trim()) {
      const spec = textSpec([c], el, false);
      if (spec) push(target, spec, childInh);
    }
  }
}

// ---------------------------------------------------------------- prepare

function materializePseudos(root) {
  const style = document.createElement('style');
  style.textContent = `[data-nop~="b"]::before{content:none!important}[data-nop~="a"]::after{content:none!important}`;
  document.head.appendChild(style);
  const els = [root, ...root.querySelectorAll('*')];
  let n = 0;
  for (const el of els) {
    if (el.tagName.toLowerCase() === 'svg' || el.closest('svg') || /^(IMG|INPUT|TEXTAREA|SELECT|BR)$/.test(el.tagName)) continue;
    for (const [pseudo, flag] of [['::before', 'b'], ['::after', 'a']]) {
      const cs = getComputedStyle(el, pseudo);
      if (!cs.content || cs.content === 'none' || cs.content === 'normal') continue;
      if (cs.display === 'none') continue;
      const span = document.createElement('span');
      span.setAttribute('data-pseudo', pseudo);
      for (let i = 0; i < cs.length; i++) {
        const p = cs[i];
        span.style.setProperty(p, cs.getPropertyValue(p));
      }
      const m = cs.content.match(/^"(.*)"$/s);
      if (m && m[1]) span.textContent = m[1];
      if (flag === 'b') el.insertBefore(span, el.firstChild);
      else el.appendChild(span);
      el.setAttribute('data-nop', ((el.getAttribute('data-nop') || '') + ' ' + flag).trim());
      n++;
    }
  }
  return n;
}

function neutralizeTransforms(root) {
  const els = [root, ...root.querySelectorAll('*')];
  const found = [];
  for (const el of els) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const cs = getComputedStyle(el);
    if (cs.translate !== 'none' || cs.rotate !== 'none' || cs.scale !== 'none') warns.push('individual transform on ' + nameOf(el));
    if (cs.transform === 'none') continue;
    const m = new DOMMatrix(cs.transform);
    const o = cs.transformOrigin.split(' ').map(px);
    found.push([el, { m: [m.a, m.b, m.c, m.d, m.e, m.f].map((v) => Math.round(v * 1e5) / 1e5), o: [o[0], o[1]] }]);
  }
  for (const [el, xf] of found) {
    const [a, b] = xf.m;
    if (Math.abs(Math.hypot(a, b) - 1) > 0.01) warns.push('scaled transform on ' + nameOf(el));
    xforms.set(el, xf);
    el.style.setProperty('transform', 'none', 'important');
  }
  return found.length;
}

export async function run(postUrl) {
  const t0 = performance.now();
  const kill = document.createElement('style');
  kill.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}html{scrollbar-width:none}`;
  document.head.appendChild(kill);
  scrollTo(0, 0);
  for (const img of document.images) img.loading = 'eager';
  const within = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
  await within(document.fonts.ready, 5000);
  await within(Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))), 8000);

  const rootEl = document.getElementById('root');
  // letter-by-letter reveal spans back to plain inline text, so a split
  // headline lands in Figma as one editable text layer
  for (const el of rootEl.querySelectorAll('.reveal-char')) el.style.setProperty('display', 'inline', 'important');
  // scroll reveals in their final state: everything shown, the fan spread
  for (const el of rootEl.querySelectorAll('[data-reveal]')) el.classList.add('is-in');
  // buttons carry a second copy of their label for the hover roll — not a layer
  for (const el of rootEl.querySelectorAll('.btn__roll--next')) el.style.setProperty('display', 'none', 'important');
  for (const el of rootEl.querySelectorAll('.fan')) el.style.setProperty('--fan', '1');
  const pseudos = materializePseudos(rootEl);
  const nx = neutralizeTransforms(rootEl);
  void document.body.offsetHeight;

  const W = document.documentElement.clientWidth;
  const H = document.documentElement.scrollHeight;
  const bodyBg = color(getComputedStyle(document.body).backgroundColor) || { r: 1, g: 1, b: 1, a: 1 };
  const root = { t: 'frame', name: 'page', x: 0, y: 0, w: W, h: H, fills: [solid(bodyBg)], clip: true, children: [] };
  for (const c of rootEl.children) await walk(c, root, 0);

  for (const job of imgJobs) {
    try { await runImageJob(job); } catch (e) { warns.push('image failed ' + job.src + ' ' + e.message); }
  }
  const out = { url: location.href, title: document.title, W, H, root, images, warns, pseudos, transforms: nx, ms: Math.round(performance.now() - t0) };
  const body = JSON.stringify(out);
  const res = await fetch(postUrl, { method: 'POST', body });
  const count = (n) => 1 + (n.children || []).reduce((s, c) => s + count(c), 0);
  return { post: await res.text(), bytes: body.length, nodes: count(root), images: Object.keys(images).length, W, H, pseudos, transforms: nx, warns: warns.slice(0, 20), ms: out.ms };
}
