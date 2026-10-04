// Push dump.json into the open Figma file through the Figmosha bridge.
// Usage: node build.mjs [x] [y]
import fs from 'fs';
import crypto from 'crypto';

const BRIDGE = 'http://localhost:8787/exec';
// node build.mjs [x] [y] [marker] [frame name] [dump file]
const X = +(process.argv[2] ?? 7400), Y = +(process.argv[3] ?? 0);
const MARK = process.argv[4] || 'home';
const NAME = process.argv[5] || 'Бавись — Головна 1440 (парні шрифти)';
const d = JSON.parse(fs.readFileSync(new URL('./' + (process.argv[6] || 'dump.json'), import.meta.url), 'utf8'));

async function ex(code, timeout = 600) {
  const r = await fetch(BRIDGE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout }) });
  const j = await r.json();
  if (!j.ok) throw new Error(`${j.error}\n${j.hint || ''}\n${j.stack || ''}`);
  return j.value !== undefined ? j.value : j.result;
}

// ---------------------------------------------------------------- figma side
const FIG = String.raw`
const STY = (w) => (w <= 300 ? 'Light' : w <= 400 ? 'Regular' : w <= 500 ? 'Medium' : w <= 600 ? 'SemiBold' : 'Bold');
async function fonts() { for (const s of ['Light', 'Regular', 'Medium', 'SemiBold', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s }); }
let COUNT = 0;
function paintOf(p) {
  if (p.type === 'IMAGE') return { type: 'IMAGE', imageHash: HASH[p.key], scaleMode: 'FILL' };
  return p;
}
function place(node, n, lx, ly, warn) {
  if (!n.xf) { node.x = lx; node.y = ly; return; }
  const [a, b, c, d, e, f] = n.xf.m, [ox, oy] = n.xf.o;
  if (Math.abs(Math.hypot(a, b) - 1) > 0.01) { node.x = lx + e; node.y = ly + f; warn.push('scale ignored: ' + n.name); return; }
  node.relativeTransform = [[a, c, Math.round(lx + ox + e - (a * ox + c * oy))], [b, d, Math.round(ly + oy + f - (b * ox + d * oy))]];
}
function setEffects(node, fx, warn, name) {
  if (!fx || !fx.length) return;
  try { node.effects = fx; }
  catch (e) {
    try { node.effects = fx.map((x) => (x.type.endsWith('BLUR') ? { ...x, blurType: 'NORMAL' } : x)); }
    catch (e2) { warn.push('effects ' + name + ': ' + e2.message); }
  }
}
function setRadius(node, r) {
  if (!r) return;
  node.topLeftRadius = r[0]; node.topRightRadius = r[1]; node.bottomRightRadius = r[2]; node.bottomLeftRadius = r[3];
}
async function build(n, parent, ox, oy, warn) {
  const lx = n.x - ox, ly = n.y - oy;
  let node;
  try {
    if (n.t === 'frame') {
      node = figma.createFrame();
      parent.appendChild(node);
      node.name = n.name;
      node.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
      node.fills = (n.fills || []).map(paintOf);
      node.clipsContent = !!n.clip;
      setRadius(node, n.radius);
      if (n.stroke) {
        node.strokes = [{ type: 'SOLID', color: n.stroke.color, opacity: n.stroke.a }];
        node.strokeAlign = 'INSIDE';
        const [t, r, b, l] = n.stroke.w;
        if (t === r && r === b && b === l) node.strokeWeight = t;
        else { node.strokeTopWeight = t; node.strokeRightWeight = r; node.strokeBottomWeight = b; node.strokeLeftWeight = l; }
        if (n.stroke.dash) node.dashPattern = n.stroke.dash;
      }
      setEffects(node, n.effects, warn, n.name);
      if (n.opacity != null) node.opacity = n.opacity;
      place(node, n, lx, ly, warn);
      COUNT++;
      const kids = (n.children || []).slice().sort((a, b) => a.layer - b.layer || a.o - b.o);
      for (const c of kids) await build(c, node, n.x, n.y, warn);
    } else if (n.t === 'text') {
      node = figma.createText();
      parent.appendChild(node);
      const r0 = n.runs[0];
      node.fontName = { family: 'Comfortaa', style: STY(r0.fw) };
      node.fontSize = r0.fs;
      const fill = (chars) => {
        node.characters = chars;
        if (n.lh) node.lineHeight = { unit: 'PIXELS', value: n.lh };
        node.textAlignHorizontal = n.align;
        for (const r of n.runs) {
          if (r.e <= r.s) continue;
          node.setRangeFontName(r.s, r.e, { family: 'Comfortaa', style: STY(r.fw) });
          node.setRangeFontSize(r.s, r.e, r.fs);
          node.setRangeFills(r.s, r.e, [{ type: 'SOLID', color: r.c, opacity: r.a }]);
          if (r.ls) node.setRangeLetterSpacing(r.s, r.e, { unit: 'PERCENT', value: r.ls });
          if (r.lh) node.setRangeLineHeight(r.s, r.e, { unit: 'PIXELS', value: r.lh });
          if (r.u) node.setRangeTextDecoration(r.s, r.e, 'UNDERLINE');
        }
      };
      fill(n.chars);
      let x = lx;
      if (n.mode === 'auto') {
        // measure the hugging width, then fix it to the next whole pixel
        node.textAutoResize = 'WIDTH_AND_HEIGHT';
        const w0 = node.width, w = Math.ceil((w0 - 0.001) / 2) * 2; // even width
        node.textAutoResize = 'NONE';
        node.resize(w, 10);
        node.textAutoResize = 'HEIGHT';
        if (n.align === 'CENTER') x = Math.round(x - (w - w0) / 2);
        if (n.align === 'RIGHT') x = Math.round(x - (w - w0));
      } else {
        node.textAutoResize = 'NONE';
        node.resize(n.w, 10);
        node.textAutoResize = 'HEIGHT';
        if (n.lh) {
          let w = n.w, lines = Math.round(node.height / n.lh);
          while (lines > n.lines && w < n.w * 1.06) {
            w += 2; node.textAutoResize = 'NONE'; node.resize(w, 10); node.textAutoResize = 'HEIGHT';
            lines = Math.round(node.height / n.lh);
          }
          if (lines !== n.lines && n.brk && n.brk.length) {
            // browser balanced the lines (text-wrap: pretty) — keep its breaks
            node.textAutoResize = 'NONE'; node.resize(n.w, 10);
            w = n.w;
            const a = [...n.chars];
            for (const i of n.brk) a[i] = ' ';
            fill(a.join(''));
            node.textAutoResize = 'HEIGHT';
            lines = Math.round(node.height / n.lh);
          }
          if (n.align === 'CENTER') x -= (w - n.w) / 2;
          if (n.align === 'RIGHT') x -= w - n.w;
          if (lines !== n.lines) warn.push('lines ' + lines + '≠' + n.lines + ': ' + n.chars.slice(0, 30));
        }
      }
      node.x = x; node.y = ly;
      COUNT++;
    } else if (n.t === 'img') {
      node = figma.createRectangle();
      parent.appendChild(node);
      node.name = n.name;
      node.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
      node.fills = [paintOf({ type: 'IMAGE', key: n.key })];
      setRadius(node, n.radius);
      setEffects(node, n.effects, warn, n.name);
      if (n.opacity != null && n.opacity < 1) node.opacity = n.opacity;
      place(node, n, lx, ly, warn);
      COUNT++;
    } else if (n.t === 'svg' || n.t === 'svgmask') {
      node = figma.createNodeFromSvg(n.svg);
      parent.appendChild(node);
      node.name = n.name;
      node.fills = [];
      if (Math.abs(node.width - n.w) > 0.001 || Math.abs(node.height - n.h) > 0.001) {
        node.rescale(n.w / node.width); // scales the vectors with the frame
        if (Math.abs(node.height - n.h) > 0.001) node.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
      }
      if (n.t === 'svgmask' && n.color) {
        const paint = [{ type: 'SOLID', color: { r: n.color.r, g: n.color.g, b: n.color.b }, opacity: n.color.a }];
        for (const v of node.findAll((x) => 'fills' in x && Array.isArray(x.fills) && x.fills.length)) v.fills = paint;
      }
      if (n.opacity != null && n.opacity < 1) node.opacity = n.opacity;
      place(node, n, lx, ly, warn);
      COUNT++;
    }
  } catch (e) {
    warn.push(n.t + ' ' + (n.name || '') + ': ' + e.message);
  }
}
`;

// ---------------------------------------------------------------- run
const t0 = Date.now();

// 1. images (deduped by content)
const HASH = {};
const byContent = new Map();
for (const [key, url] of Object.entries(d.images)) {
  const b64 = url.slice(url.indexOf(',') + 1);
  const sig = crypto.createHash('md5').update(b64).digest('hex');
  if (!byContent.has(sig)) byContent.set(sig, await ex(`return figma.createImage(figma.base64Decode(${JSON.stringify(b64)})).hash;`));
  HASH[key] = byContent.get(sig);
}
console.log('images', Object.keys(HASH).length, 'unique', byContent.size, `${Date.now() - t0}ms`);

// 2. root frame (replaces an earlier import with the same marker)
const root = d.root;
const rootId = await ex(`
  // always the «Сайт» page; an earlier import (even inside a section) keeps its spot, name and layer order
  await figma.setCurrentPageAsync(figma.root.children.find(p => p.name === 'Сайт'));
  const old = figma.currentPage.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === ${JSON.stringify(MARK)})[0];
  const f = figma.createFrame();
  f.name = old ? old.name : ${JSON.stringify(NAME)};
  f.resize(${root.w}, ${root.h});
  if (old) { old.parent.insertChild(old.parent.children.indexOf(old), f); f.x = old.x; f.y = old.y; old.remove(); }
  else { f.x = ${X}; f.y = ${Y}; }
  f.fills = ${JSON.stringify(root.fills)};
  f.clipsContent = true;
  f.setPluginData('bavys-import', ${JSON.stringify(MARK)});
  return f.id;
`);
console.log('root', rootId);

// 3. one exec per top-level block, in paint order
const kids = root.children.slice().sort((a, b) => a.layer - b.layer || a.o - b.o);
let total = 1;
const warnings = [];
for (const k of kids) {
  const res = await ex(`
    const HASH = ${JSON.stringify(HASH)};
    ${FIG}
    await fonts();
    const parent = await figma.getNodeByIdAsync(${JSON.stringify(rootId)});
    const warn = [];
    await build(${JSON.stringify(k)}, parent, 0, 0, warn);
    return { count: COUNT, warn };
  `);
  total += res.count;
  warnings.push(...res.warn);
  console.log(`${k.name.padEnd(16)} nodes ${String(res.count).padStart(4)}  warn ${res.warn.length}`);
}

await ex(`const f = await figma.getNodeByIdAsync(${JSON.stringify(rootId)}); figma.currentPage.selection = [f]; figma.viewport.scrollAndZoomIntoView([f]); return true;`);
console.log('total nodes', total, `${Date.now() - t0}ms`);
if (warnings.length) console.log('WARNINGS\n' + warnings.join('\n'));
