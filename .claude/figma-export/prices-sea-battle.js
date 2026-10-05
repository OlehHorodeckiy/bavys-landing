const ICONS = {"wallet": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"3\" /> <path d=\"M3 10h18M16 14.5h1.5\" /></svg>", "calendar": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"3\" /> <path d=\"M3.5 10h17M8 3v4M16 3v4\" /></svg>", "clock": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\" /> <path d=\"M12 7.5V12l3 2\" /></svg>", "tag": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0Z\" /> <circle cx=\"8\" cy=\"8\" r=\"1.5\" /></svg>", "truck": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.5h11v10h-11ZM13.5 10h4l3.5 3.5v3h-7.5\" /> <circle cx=\"6.5\" cy=\"17.5\" r=\"1.8\" /> <circle cx=\"17\" cy=\"17.5\" r=\"1.8\" /></svg>", "sparkle": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.5c.7 4.3 2.2 5.8 6.5 6.5-4.3.7-5.8 2.2-6.5 6.5-.7-4.3-2.2-5.8-6.5-6.5 4.3-.7 5.8-2.2 6.5-6.5ZM18.5 15.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z\" /></svg>", "chat": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5.5h16v10.5H9.5L5 20v-4H4Z M8 9.5h8M8 12.5h5\" /></svg>", "check": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 12.5 4.5 4.5L19 7.5\" /></svg>", "plus": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14M5 12h14\" /></svg>", "home": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1Z\" /></svg>", "arrow": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2B1003\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 17 17 7M9 7h8v8\"/></svg>"};
for (const s of ['Light', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
const C = { deep: '#2b1003', primary: '#866452', ink: '#6b584e', cream: '#f9f6f3', white: '#ffffff', muted: '#9a8a80' };
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, o) => [o === undefined ? { type: 'SOLID', color: hex(h) } : { type: 'SOLID', color: hex(h), opacity: o }];
const NB = ' ';
function AL(dir, o = {}) {
  const f = figma.createFrame(); f.name = o.name || 'frame'; f.layoutMode = dir; f.itemSpacing = o.gap || 0;
  f.fills = o.fill ? solid(o.fill) : []; if (o.radius) f.cornerRadius = o.radius;
  if (o.pad) { f.paddingTop = o.pad[0]; f.paddingRight = o.pad[1]; f.paddingBottom = o.pad[2]; f.paddingLeft = o.pad[3]; }
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
  if (o.align) f.counterAxisAlignItems = o.align; if (o.justify) f.primaryAxisAlignItems = o.justify;
  f.clipsContent = false; return f;
}
function fixW(f, w) { if (f.layoutMode === 'VERTICAL') f.counterAxisSizingMode = 'FIXED'; else f.primaryAxisSizingMode = 'FIXED'; f.resize(w, f.height); return f; }
function fixWH(f, w, h) { f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.resize(w, h); return f; }
function add(p, ...kids) { for (const k of kids) if (k) p.appendChild(k); return p; }
function T(chars, o = {}) {
  const t = figma.createText(); t.fontName = { family: 'Comfortaa', style: o.style || 'Medium' }; t.characters = chars;
  t.fontSize = o.size || 16; t.lineHeight = { unit: 'PIXELS', value: o.lh || 26 }; t.fills = o.opacity !== undefined ? solid(o.color || C.deep, o.opacity) : solid(o.color || C.deep);
  if (o.align) t.textAlignHorizontal = o.align; if (o.ls) t.letterSpacing = { unit: 'PERCENT', value: o.ls };
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.name = chars.replace(/\n/g, ' ').slice(0, 40); return t;
}
function title(a, b, o) {
  const sep = o.br ? '\n' : ' ';
  const t = T(a + sep + b, { ...o, style: 'Bold' }); const s = a.length + 1;
  t.setRangeFontName(s, s + b.length, { family: 'Comfortaa', style: 'Light' }); t.setRangeFills(s, s + b.length, solid(o.accent || C.primary));
  t.name = a + ' ' + b; return t;
}
function pill(label, bg) {
  const p = AL('HORIZONTAL', { name: 'pill', fill: bg, radius: 16, pad: [8, 16, 8, 16], gap: 8, align: 'CENTER' });
  const d = figma.createEllipse(); d.resize(6, 6); d.fills = solid(C.deep); d.name = 'pill__dot';
  return add(p, d, T(label.toUpperCase(), { size: 12, lh: 16, style: 'Bold', ls: 8 }));
}
function chip(label, bg, color, small) {
  const c = AL('HORIZONTAL', { name: 'chip', fill: bg, radius: 12, pad: small ? [4, 8, 4, 8] : [4, 10, 4, 10], align: 'CENTER' });
  return add(c, T(label, { size: 12, lh: 16, style: 'Bold', color }));
}
function svg(name, size, color) {
  let s = ICONS[name]; if (color) s = s.replace(/stroke="#[0-9A-Fa-f]{6}"/, 'stroke="' + color + '"');
  const n = figma.createNodeFromSvg(s); n.name = 'icon · ' + name; n.fills = []; n.clipsContent = false; n.rescale(size / 24); return n;
}
function iconCircle(name, bg) {
  const c = fixWH(AL('HORIZONTAL', { name: 'icon', fill: bg, radius: 20, align: 'CENTER', justify: 'CENTER' }), 40, 40);
  return add(c, svg(name, 20));
}
function btn(label, full) {
  const b = AL('HORIZONTAL', { name: 'btn', fill: C.primary, radius: 26, pad: [7, 7, 7, 24], gap: 16, align: 'CENTER' });
  add(b, T(label, { size: 16, lh: 18, style: 'Bold', color: C.white }));
  const d = fixWH(AL('HORIZONTAL', { name: 'btn__disc', fill: C.white, radius: 19, align: 'CENTER', justify: 'CENTER' }), 38, 38);
  add(b, add(d, svg('arrow', 16)));
  if (full) { b.primaryAxisSizingMode = 'FIXED'; b.primaryAxisAlignItems = 'SPACE_BETWEEN'; b.resize(full, 52); }
  return b;
}
function section(name, bg, top, bottom, W) { const s = AL('VERTICAL', { name, fill: bg, pad: [top, 0, bottom, 0], align: 'CENTER' }); return fixW(s, W); }
async function clone(id) { const n = await figma.getNodeByIdAsync(id); return n.clone(); }

const PRICES = [
  { n: '1 гра', price: '850' + NB + 'грн', chip: null, line: 'базова ціна' },
  { n: '2 гри', price: '1650' + NB + 'грн', chip: '−50' + NB + 'грн', line: 'замість 1700' + NB + 'грн' },
  { n: '3 гри', price: '2450' + NB + 'грн', chip: '−100' + NB + 'грн', line: 'замість 2550' + NB + 'грн' },
  { n: '4 гри', price: '3200' + NB + 'грн', chip: '−200' + NB + 'грн', line: 'замість 3400' + NB + 'грн', hi: true },
];
const TERMS = [
  ['calendar', 'Доба оренди', 'З дня отримання до наступного дня включно.'],
  ['clock', 'Повернення', 'Наступного дня до 12:00.'],
  ['wallet', 'Без передоплати', 'Бронь фіксує адміністратор, коли зателефонує вам.'],
  ['tag', 'Застава', 'Залежить від кількості ігор: суму назвемо, коли підтверджуватимемо бронь.'],
  ['truck', 'Доставка або самовивіз', 'Привозимо по Львову та області, або заберіть ігри зі складу за попереднім записом.'],
  ['sparkle', 'Підкладка для Дженги', 'Безкоштовно, якщо свято на плитці чи асфальті.'],
];
const nb = (s) => s.replace(/(\d) (?=[а-яіїєґa-z\d])/gi, '$1' + NB);

function priceCard(p, W, m) {
  const fg = p.hi ? C.white : C.deep;
  const card = AL('VERTICAL', { name: 'price-card' + (p.hi ? ' · найвигідніше' : ''), fill: p.hi ? C.primary : C.cream, radius: m ? 20 : 24, pad: m ? [20, 20, 20, 20] : [28, 28, 28, 28], gap: m ? 24 : 40 });
  fixW(card, W);
  const top = AL('HORIZONTAL', { name: 'price-card__top', justify: 'SPACE_BETWEEN', align: 'CENTER' });
  add(card, top); top.layoutSizingHorizontal = 'FILL';
  add(top, T(p.n, { size: m ? 14 : 18, lh: m ? 20 : 26, style: 'Bold', color: fg }));
  if (p.chip) add(top, chip(p.chip, C.white, C.primary, m));
  const bottom = AL('VERTICAL', { name: 'price-card__price', gap: m ? 16 : 24 });
  const pr = AL('VERTICAL', { name: 'price', gap: 4 });
  add(pr, T(p.price, { size: m ? 30 : 48, lh: m ? 36 : 56, style: 'Bold', color: fg }), T('за добу', { size: m ? 14 : 16, lh: m ? 20 : 26, color: p.hi ? C.white : C.ink, opacity: p.hi ? 0.8 : undefined }));
  add(bottom, pr, T(p.line, { size: 14, lh: 20, color: p.hi ? C.white : C.muted, opacity: p.hi ? 0.8 : undefined }));
  add(card, bottom);
  return card;
}
function note(text, w) {
  const r = AL('HORIZONTAL', { name: 'price-note', gap: 12, align: 'CENTER' });
  add(r, iconCircle('plus', C.cream), T(text, { size: 16, lh: 26, style: 'Medium', color: C.ink, w }));
  return r;
}
function termTile(t, W, m) {
  const tile = AL('VERTICAL', { name: 'term-tile', fill: C.cream, radius: 20, pad: m ? [20, 20, 20, 20] : [24, 24, 24, 24], gap: m ? 16 : 24 });
  fixW(tile, W);
  const tx = AL('VERTICAL', { name: 'term-tile__text', gap: 8 });
  add(tile, iconCircle(t[0], C.white), tx);
  tx.layoutSizingHorizontal = 'FILL';
  const a = T(t[1], { size: 18, lh: 26, style: 'Bold' }); const b = T(nb(t[2]), { size: 16, lh: 26, color: C.ink });
  add(tx, a, b); a.layoutSizingHorizontal = 'FILL'; b.layoutSizingHorizontal = 'FILL'; a.textAutoResize = 'HEIGHT'; b.textAutoResize = 'HEIGHT';
  return tile;
}

// games with their own price (Instagram «Ціни», 1 вересня)
const SPECIAL = [
  { name: 'Велика Дженга', price: '1200' + NB + 'грн', per: 'за добу', extra: null, note: 'Якщо свято на плитці чи асфальті, м’яку підкладку даємо безкоштовно.' },
  { name: 'Бірпонг', price: '1500' + NB + 'грн', per: 'за добу', extra: 'Комплект для гри: +500' + NB + 'грн', note: '12 червоних і 12 синіх стаканчиків, 6 м’ячиків. Можна взяти свої.' },
  { name: 'Стіл для ігор', price: '120' + NB + 'грн', per: 'за 1 стіл', extra: null, note: 'Дерев’яний розкладний стіл під настільні ігри.' },
];
function specialCard(s, W, m) {
  const card = AL('VERTICAL', { name: 'special-card', fill: C.white, radius: m ? 20 : 24, pad: m ? [20, 20, 20, 20] : [28, 28, 28, 28], gap: m ? 20 : 24 });
  fixW(card, W);
  const pr = AL('VERTICAL', { name: 'price', gap: 4 });
  add(pr, T(s.price, { size: m ? 30 : 40, lh: m ? 36 : 48, style: 'Bold' }), T(s.per, { size: m ? 14 : 16, lh: m ? 20 : 26, color: C.ink }));
  const top = AL('VERTICAL', { name: 'special-card__head', gap: m ? 12 : 16 });
  add(top, T(s.name, { size: m ? 18 : 22, lh: m ? 26 : 30, style: 'Bold' }), pr);
  add(card, top);
  const foot = AL('VERTICAL', { name: 'special-card__note', gap: 12 });
  add(card, foot); foot.layoutSizingHorizontal = 'FILL';
  if (s.extra) add(foot, chip(s.extra, C.cream, C.primary, m));
  const n = T(nb(s.note), { size: 14, lh: 20, color: C.muted }); add(foot, n); n.layoutSizingHorizontal = 'FILL'; n.textAutoResize = 'HEIGHT';
  return card;
}

const SEA = { name: 'Великий морський бій', price: '2000' + NB + 'грн', per: 'за добу', extra: null, note: 'Розстав кораблі на великому дерев’яному полі й топи флот суперника.' };
const SEA_PHOTO = '19c0fbd69bfad11b060f0464ec5620ed7e7ac5bb';
function img(hash, w, h, r, name) { const x = figma.createRectangle(); x.name = name || 'фото'; x.resize(w, h); if (r) x.cornerRadius = r; x.fills = [{ type: 'IMAGE', imageHash: hash, scaleMode: 'FILL' }]; return x; }
for (const s of ['Light', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
const out = {};
const setText = (fr, from, to) => { for (const t of fr.findAll((n) => n.type === 'TEXT' && n.characters.includes(from))) { t.characters = t.characters.replace(from, to); } };
const FR = { base: ['1592:1533', '1592:1868'], A: ['1592:2205', '1592:2632'], B: ['1592:3063', '1592:3468'] };
for (const v of Object.keys(FR)) {
  for (const [i, fid] of FR[v].entries()) {
    const m = i === 1; const f = await figma.getNodeByIdAsync(fid);
    // texts
    setText(f, 'Велика Дженга і Бірпонг мають свою ціну.', 'Велика Дженга, Бірпонг і Морський бій мають свою ціну.');
    setText(f, 'Велика Дженга, Бірпонг і столи для ігор мають свою ціну.', 'Велика Дженга, Бірпонг, Морський бій і столи для ігор мають свою ціну.');
    setText(f, 'Велика Дженга 1200' + NB + 'грн, Бірпонг 1500' + NB + 'грн.', 'Велика Дженга 1200' + NB + 'грн, Бірпонг 1500' + NB + 'грн, Великий морський бій 2000' + NB + 'грн.');
    const list = f.findOne((n) => n.name === 'special-cards');
    if (list.findOne((n) => n.type === 'TEXT' && n.characters === SEA.name)) { out[v + i] = 'already'; continue; }
    const cards = list.children.filter((c) => c.name === 'special-card');
    const W = m ? 350 : 308;
    let sea;
    if (v === 'base') sea = specialCard(SEA, W, m);
    if (v === 'A') {
      const ph = m ? 200 : 220;
      if (!m) for (const c of cards) { c.resize(W, c.height); const p = c.findChild((n) => n.type === 'RECTANGLE'); p.resize(W, ph); }
      // same build as variant A
      sea = AL('VERTICAL', { name: 'special-card', fill: C.white, radius: m ? 20 : 24 }); fixW(sea, W); sea.clipsContent = true;
      add(sea, img(SEA_PHOTO, W, ph, 0, 'фото · ' + SEA.name));
      const body = AL('VERTICAL', { name: 'special-card__body', pad: m ? [20, 20, 20, 20] : [28, 28, 28, 28], gap: 16 }); add(sea, body); body.layoutSizingHorizontal = 'FILL';
      const row = AL('HORIZONTAL', { name: 'special-card__head', justify: 'SPACE_BETWEEN', align: 'MIN', gap: 12 }); add(body, row); row.layoutSizingHorizontal = 'FILL';
      const pr = AL('VERTICAL', { name: 'price', gap: 0, align: 'MAX' });
      add(pr, T(SEA.price, { size: m ? 24 : 28, lh: m ? 30 : 36, style: 'Bold', align: 'RIGHT' }), T(SEA.per, { size: 14, lh: 20, color: C.ink, align: 'RIGHT' }));
      const nm = T(SEA.name, { size: m ? 18 : 22, lh: m ? 26 : 30, style: 'Bold' }); add(row, nm, pr); nm.layoutGrow = 1; nm.textAutoResize = 'HEIGHT';
      const foot = AL('VERTICAL', { name: 'special-card__note', gap: 12 }); add(body, foot); foot.layoutSizingHorizontal = 'FILL';
      const n = T(nb(SEA.note), { size: 14, lh: 20, color: C.muted }); add(foot, n); n.layoutSizingHorizontal = 'FILL'; n.textAutoResize = 'HEIGHT';
      // the other names may need to wrap next to the price at 308
      if (!m) for (const c of cards) { const t = c.findOne((x) => x.name === 'special-card__head'); const nmx = t.children[0]; nmx.layoutGrow = 1; nmx.textAutoResize = 'HEIGHT'; t.itemSpacing = 12; }
    }
    if (v === 'B') {
      const ph = m ? 220 : 240;
      if (!m) for (const c of cards) { c.resize(W, c.height); const media = c.findChild((n) => n.name === 'special-card__media'); media.resize(W - 24, ph); const tag = media.findChild((n) => n.name === 'price-tag'); tag.y = ph - 16 - tag.height; const body = c.findChild((n) => n.name === 'special-card__body'); body.resize(W - 24 - 32, body.height); }
      // clone the Jenga card and swap its content
      sea = cards[0].clone();
      const media = sea.findChild((n) => n.name === 'special-card__media'); const pic = media.findChild((n) => n.type === 'RECTANGLE'); pic.fills = [{ type: 'IMAGE', imageHash: SEA_PHOTO, scaleMode: 'FILL' }]; pic.name = 'фото · ' + SEA.name;
      const tag = media.findChild((n) => n.name === 'price-tag'); tag.children[0].characters = SEA.price;
      const body = sea.findChild((n) => n.name === 'special-card__body'); body.children[0].characters = SEA.name; body.children[1].characters = nb(SEA.note);
    }
    // after Бірпонг, before the table
    const idx = list.children.findIndex((c) => c.findOne && c.findOne((t) => t.type === 'TEXT' && t.characters === 'Стіл для ігор'));
    list.insertChild(idx, sea);
    if (!m) for (const c of list.children) c.layoutSizingVertical = 'FILL';
    const hi = f.findChild((n) => n.name === 'iOS · Home indicator'); if (hi) hi.y = f.height - hi.height;
    out[v + (m ? ' 390' : ' 1440')] = [list.children.length, Math.round(list.width), Math.round(list.height)];
  }
}
return out;
