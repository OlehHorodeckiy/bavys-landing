const ICONS = {"wallet": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"3\" /> <path d=\"M3 10h18M16 14.5h1.5\" /></svg>", "calendar": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"3\" /> <path d=\"M3.5 10h17M8 3v4M16 3v4\" /></svg>", "clock": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\" /> <path d=\"M12 7.5V12l3 2\" /></svg>", "tag": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0Z\" /> <circle cx=\"8\" cy=\"8\" r=\"1.5\" /></svg>", "truck": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.5h11v10h-11ZM13.5 10h4l3.5 3.5v3h-7.5\" /> <circle cx=\"6.5\" cy=\"17.5\" r=\"1.8\" /> <circle cx=\"17\" cy=\"17.5\" r=\"1.8\" /></svg>", "sparkle": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.5c.7 4.3 2.2 5.8 6.5 6.5-4.3.7-5.8 2.2-6.5 6.5-.7-4.3-2.2-5.8-6.5-6.5 4.3-.7 5.8-2.2 6.5-6.5ZM18.5 15.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z\" /></svg>", "chat": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5.5h16v10.5H9.5L5 20v-4H4Z M8 9.5h8M8 12.5h5\" /></svg>", "check": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 12.5 4.5 4.5L19 7.5\" /></svg>", "plus": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14M5 12h14\" /></svg>", "home": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#C78460\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1Z\" /></svg>", "arrow": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2B1003\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 17 17 7M9 7h8v8\"/></svg>"};
const HASHES = {"jenga": "5a08bbac430a5db0e09a4c071d6bca4d479c79e9", "kiltsekyd": "d9621f318c1366fd0ac9e5e657cc73706151d846", "kornkhol": "da5a94ae4edf446a11763e26e281d35efdc23e48", "connect4": "aea7eff57555eb668a8ebf078dd41d504205502e", "galaktyka": "b347f04eaad7ad1ffa590ada3a794a70bfdf3d75", "birponh": "d698213e2efc4092cdf7a353910d7dac5df5b750", "evPark": "20b89823f19eb80f82a4c143a70aea1370cc5a1d", "evJengaFest": "8b9b9084e2d4cc9f47a9b1643e7a8799164bf8c2", "evGalaktyka": "ec1f0620a2ba0691ab417281f98014a89230e5e6", "evConnect4": "fa2befa3e1e816f403bcb78ab188e25a35ef14a3", "evWedding": "c0ba83ba40a2cc47396471aa5177abee54238dd8", "evStand": "d43bf074056731e54dea1895e70079aafa2acbaa", "evLounge": "a670360f0b7caebd1eb1f6875d2e567d4d816dd3"};
const ABOUT_TABLE = "6f8c8a91171a323259a0d129b37f029dbc2c8fe6";
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

const H = HASHES;
function img(hash, w, h, r, name) { const x = figma.createRectangle(); x.name = name || 'фото'; x.resize(w, h); if (r) x.cornerRadius = r; x.fills = [{ type: 'IMAGE', imageHash: hash, scaleMode: 'FILL' }]; return x; }
const sec = await figma.getNodeByIdAsync('1592:1531');
for (const old of sec.children.filter((n) => n.getPluginData('prices-variant'))) old.remove();
const baseD = await figma.getNodeByIdAsync('1592:1533'), baseM = await figma.getNodeByIdAsync('1592:1868');
function mark(n) { n.setPluginData('prices-variant', '1'); return n; }
function variantFrame(base, name, x) {
  const f = mark(base.clone()); sec.appendChild(f); f.name = name; f.x = x; f.y = base.y;
  for (const k of f.children.filter((c) => c.name === 'prices-hero' || c.name === 'prices-special')) k.remove();
  return f;
}
function headDesk(alignLeft) {
  const head = AL('VERTICAL', { name: 'page-title', gap: 20, align: alignLeft ? 'MIN' : 'CENTER' });
  const ht = AL('VERTICAL', { name: 'page-title__text', gap: 24, align: alignLeft ? 'MIN' : 'CENTER' });
  add(ht, title('Скільки коштує', 'оренда ігор', { size: alignLeft ? 48 : 60, lh: alignLeft ? 56 : 64, align: alignLeft ? 'LEFT' : 'CENTER', br: alignLeft }),
    T('Що більше ігор берете, то вигідніше кожна. Велика Дженга і Бірпонг мають свою ціну.', { size: alignLeft ? 18 : 20, lh: alignLeft ? 30 : 34, color: C.ink, w: alignLeft ? 560 : 760, align: alignLeft ? 'LEFT' : 'CENTER' }));
  return add(head, pill('Ціни', C.cream), ht);
}
function headMob() {
  const mh = AL('VERTICAL', { name: 'page-title', gap: 16, align: 'CENTER' });
  const mht = AL('VERTICAL', { name: 'page-title__text', gap: 16, align: 'CENTER' });
  add(mht, title('Скільки коштує', 'оренда ігор', { size: 30, lh: 36, align: 'CENTER', br: true, w: 350 }), T('Що більше ігор берете, то вигідніше кожна. Велика Дженга і Бірпонг мають свою ціну.', { size: 18, lh: 30, color: C.ink, w: 350, align: 'CENTER' }));
  return add(mh, pill('Ціни', C.cream), mht);
}
function specialHead(m) {
  const h = AL('VERTICAL', { name: 'section-head', gap: 16, align: 'CENTER' });
  return add(h, title('Окрема', 'ціна', { size: m ? 30 : 48, lh: m ? 36 : 56, align: 'CENTER' }), T('Велика Дженга, Бірпонг і столи для ігор мають свою ціну.', { size: 18, lh: m ? 30 : 28, color: C.ink, align: 'CENTER', w: m ? 350 : undefined }));
}
const PKG_PHOTO = [H.connect4, H.kornkhol, H.galaktyka, H.evPark];
const SPECIAL_PHOTO = [H.jenga, H.birponh, ABOUT_TABLE];

// ---------- variant A: photo on top of every card
function photoPriceCard(p, photo, W, ph, m) {
  const fg = p.hi ? C.white : C.deep;
  const card = AL('VERTICAL', { name: 'price-card' + (p.hi ? ' · найвигідніше' : ''), fill: p.hi ? C.primary : C.cream, radius: m ? 20 : 24 }); fixW(card, W); card.clipsContent = true;
  add(card, img(photo, W, ph, 0, 'фото'));
  const body = AL('VERTICAL', { name: 'price-card__body', pad: m ? [16, 16, 16, 16] : [24, 24, 24, 24], gap: m ? 16 : 24 });
  add(card, body); body.layoutSizingHorizontal = 'FILL';
  const top = AL('HORIZONTAL', { name: 'price-card__top', justify: 'SPACE_BETWEEN', align: 'CENTER' }); add(body, top); top.layoutSizingHorizontal = 'FILL';
  add(top, T(p.n, { size: m ? 14 : 18, lh: m ? 20 : 26, style: 'Bold', color: fg })); if (p.chip) add(top, chip(p.chip, C.white, C.primary, m));
  const pr = AL('VERTICAL', { name: 'price', gap: 4 });
  add(pr, T(p.price, { size: m ? 26 : 40, lh: m ? 32 : 48, style: 'Bold', color: fg }), T((m ? 'за добу\n' : 'за добу · ') + p.line, { size: m ? 12 : 14, lh: m ? 16 : 20, color: p.hi ? C.white : C.muted, opacity: p.hi ? 0.8 : undefined }));
  add(body, pr);
  return card;
}
function photoSpecialCard(s, photo, W, ph, m) {
  const card = AL('VERTICAL', { name: 'special-card', fill: C.white, radius: m ? 20 : 24 }); fixW(card, W); card.clipsContent = true;
  add(card, img(photo, W, ph, 0, 'фото · ' + s.name));
  const body = AL('VERTICAL', { name: 'special-card__body', pad: m ? [20, 20, 20, 20] : [28, 28, 28, 28], gap: 16 });
  add(card, body); body.layoutSizingHorizontal = 'FILL';
  const row = AL('HORIZONTAL', { name: 'special-card__head', justify: 'SPACE_BETWEEN', align: 'MIN' }); add(body, row); row.layoutSizingHorizontal = 'FILL';
  const pr = AL('VERTICAL', { name: 'price', gap: 0, align: 'MAX' });
  add(pr, T(s.price, { size: m ? 24 : 28, lh: m ? 30 : 36, style: 'Bold', align: 'RIGHT' }), T(s.per, { size: 14, lh: 20, color: C.ink, align: 'RIGHT' }));
  add(row, T(s.name, { size: m ? 18 : 22, lh: m ? 26 : 30, style: 'Bold' }), pr);
  const foot = AL('VERTICAL', { name: 'special-card__note', gap: 12 }); add(body, foot); foot.layoutSizingHorizontal = 'FILL';
  if (s.extra) add(foot, chip(s.extra, C.cream, C.primary, m));
  const n = T(nb(s.note), { size: 14, lh: 20, color: C.muted }); add(foot, n); n.layoutSizingHorizontal = 'FILL'; n.textAutoResize = 'HEIGHT';
  return card;
}

// ---------- variant B: big photo + price list, special prices as rows with photos
function priceList(W, m) {
  const box = AL('VERTICAL', { name: 'price-list', fill: C.cream, radius: m ? 20 : 24, pad: m ? [8, 8, 8, 8] : [12, 12, 12, 12], gap: 0 }); fixW(box, W);
  const rows = [...PRICES.map((p) => [p.n, p.price, p.chip, p.hi]), ['Кожна наступна гра', '+800' + NB + 'грн', null, false]];
  rows.forEach(([n, price, ch, hi], i) => {
    const r = AL('HORIZONTAL', { name: 'price-row' + (hi ? ' · найвигідніше' : ''), fill: hi ? C.primary : undefined, radius: m ? 14 : 16, pad: m ? [14, 16, 14, 16] : [18, 20, 18, 20], justify: 'SPACE_BETWEEN', align: 'CENTER' });
    add(box, r); r.layoutSizingHorizontal = 'FILL';
    if (!hi && i < rows.length - 1 && !rows[i + 1][3]) { r.strokes = solid('#d8cfc6'); r.dashPattern = [4, 4]; r.strokeAlign = 'INSIDE'; r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeBottomWeight = 1; r.strokesIncludedInLayout = true; }
    const l = AL('HORIZONTAL', { name: 'left', gap: 12, align: 'CENTER' });
    add(l, T(n, { size: m ? 16 : 18, lh: m ? 24 : 26, style: 'Bold', color: hi ? C.white : C.deep }));
    if (ch) add(l, chip(ch, C.white, C.primary, m));
    const pr = T(price, { size: m ? 20 : 24, lh: m ? 28 : 32, style: 'Bold', color: hi ? C.white : C.deep });
    add(r, l, pr);
  });
  return box;
}
function specialRow(s, photo, W, m) {
  const r = AL('HORIZONTAL', { name: 'special-row', fill: C.white, radius: m ? 20 : 24, pad: m ? [12, 12, 12, 12] : [16, 32, 16, 16], gap: m ? 16 : 32, align: 'CENTER' }); fixW(r, W);
  add(r, img(photo, m ? 96 : 160, m ? 96 : 120, m ? 14 : 16, 'фото · ' + s.name));
  const tx = AL('VERTICAL', { name: 'text', gap: 8 }); add(r, tx); tx.layoutGrow = 1;
  add(tx, T(s.name, { size: m ? 18 : 22, lh: m ? 26 : 30, style: 'Bold' }));
  if (m) add(tx, T(s.price + ' ' + s.per, { size: 16, lh: 24, style: 'Bold', color: C.primary }));
  if (s.extra) add(tx, chip(s.extra, C.cream, C.primary, m));
  const n = T(nb(s.note), { size: 14, lh: 20, color: C.muted }); add(tx, n); n.layoutSizingHorizontal = 'FILL'; n.textAutoResize = 'HEIGHT';
  if (!m) { const pr = AL('VERTICAL', { name: 'price', gap: 0, align: 'MAX' }); add(pr, T(s.price, { size: 32, lh: 40, style: 'Bold', align: 'RIGHT' }), T(s.per, { size: 14, lh: 20, color: C.ink, align: 'RIGHT' })); add(r, pr); }
  return r;
}

const X0 = 2310, out = {};
// ===== A desktop
{
  const f = variantFrame(baseD, 'Ціни — 1440 · варіант A (фото в картках)', X0);
  const s1 = section('prices-hero', C.white, 160, 80, 1440);
  const col = AL('VERTICAL', { name: 'content', gap: 56, align: 'CENTER' }); fixW(col, 1280);
  const cards = AL('VERTICAL', { name: 'prices', gap: 24, align: 'CENTER' });
  const row = AL('HORIZONTAL', { name: 'price-cards', gap: 16 });
  PRICES.forEach((p, i) => { const c = photoPriceCard(p, PKG_PHOTO[i], 308, 200, false); add(row, c); c.layoutSizingVertical = 'FILL'; });
  add(cards, row, note('П’ята і кожна наступна гра: +800' + NB + 'грн'));
  add(col, headDesk(false), cards); add(s1, col);
  const s2 = section('prices-special', C.cream, 80, 80, 1440);
  const c2 = AL('VERTICAL', { name: 'content', gap: 48, align: 'CENTER' }); fixW(c2, 1280);
  const r2 = AL('HORIZONTAL', { name: 'special-cards', gap: 16 });
  SPECIAL.forEach((s, i) => { const c = photoSpecialCard(s, SPECIAL_PHOTO[i], 416, 280, false); add(r2, c); c.layoutSizingVertical = 'FILL'; });
  add(c2, specialHead(false), r2); add(s2, c2);
  f.insertChild(0, s2); f.insertChild(0, s1); out.Adesk = [f.id, f.height];
}
// ===== A mobile
{
  const f = variantFrame(baseM, 'Ціни — 390 · варіант A (фото в картках)', X0 + 1560);
  const s1 = section('prices-hero', C.white, 182, 64, 390);
  const col = AL('VERTICAL', { name: 'content', gap: 40, align: 'CENTER' }); fixW(col, 350);
  const cards = AL('VERTICAL', { name: 'prices', gap: 24, align: 'CENTER' });
  const grid = AL('VERTICAL', { name: 'price-cards', gap: 16 });
  for (let r = 0; r < 2; r++) { const rr = AL('HORIZONTAL', { name: 'row', gap: 16 }); PRICES.slice(r * 2, r * 2 + 2).forEach((p, j) => { const c = photoPriceCard(p, PKG_PHOTO[r * 2 + j], 167, 120, true); add(rr, c); c.layoutSizingVertical = 'FILL'; }); add(grid, rr); }
  add(cards, grid, note('П’ята і кожна наступна гра: +800' + NB + 'грн', 298));
  add(col, headMob(), cards); add(s1, col);
  const s2 = section('prices-special', C.cream, 64, 64, 390);
  const c2 = AL('VERTICAL', { name: 'content', gap: 40, align: 'CENTER' }); fixW(c2, 350);
  const l2 = AL('VERTICAL', { name: 'special-cards', gap: 12 });
  SPECIAL.forEach((s, i) => add(l2, photoSpecialCard(s, SPECIAL_PHOTO[i], 350, 200, true)));
  add(c2, specialHead(true), l2); add(s2, c2);
  f.insertChild(0, s2); f.insertChild(0, s1); out.Amob = [f.id, f.height];
  const hi = f.findChild((n) => n.name === 'iOS · Home indicator'); if (hi) hi.y = f.height - hi.height;
}
// ===== B desktop
{
  const f = variantFrame(baseD, 'Ціни — 1440 · варіант B (фото + прайс)', X0 + 2190);
  const s1 = section('prices-hero', C.white, 160, 80, 1440);
  const split = AL('HORIZONTAL', { name: 'content', gap: 32 }); fixW(split, 1280);
  const left = img(H.evJengaFest, 624, 600, 24, 'фото · Дженга на фестивалі');
  const right = AL('VERTICAL', { name: 'prices', gap: 40 }); fixW(right, 624);
  const pl = priceList(624, false);
  add(right, headDesk(true), pl);
  add(split, left, right); left.layoutSizingVertical = 'FILL'; add(s1, split);
  const s2 = section('prices-special', C.cream, 80, 80, 1440);
  const c2 = AL('VERTICAL', { name: 'content', gap: 48, align: 'CENTER' }); fixW(c2, 1280);
  const l2 = AL('VERTICAL', { name: 'special-rows', gap: 16 });
  SPECIAL.forEach((s, i) => add(l2, specialRow(s, SPECIAL_PHOTO[i], 1280, false)));
  add(c2, specialHead(false), l2); add(s2, c2);
  f.insertChild(0, s2); f.insertChild(0, s1); out.Bdesk = [f.id, f.height];
}
// ===== B mobile
{
  const f = variantFrame(baseM, 'Ціни — 390 · варіант B (фото + прайс)', X0 + 2190 + 1560);
  const s1 = section('prices-hero', C.white, 182, 64, 390);
  const col = AL('VERTICAL', { name: 'content', gap: 32, align: 'CENTER' }); fixW(col, 350);
  add(col, headMob(), img(H.evJengaFest, 350, 260, 20, 'фото · Дженга на фестивалі'), priceList(350, true)); add(s1, col);
  const s2 = section('prices-special', C.cream, 64, 64, 390);
  const c2 = AL('VERTICAL', { name: 'content', gap: 40, align: 'CENTER' }); fixW(c2, 350);
  const l2 = AL('VERTICAL', { name: 'special-rows', gap: 12 });
  SPECIAL.forEach((s, i) => add(l2, specialRow(s, SPECIAL_PHOTO[i], 350, true)));
  add(c2, specialHead(true), l2); add(s2, c2);
  f.insertChild(0, s2); f.insertChild(0, s1); out.Bmob = [f.id, f.height];
  const hi = f.findChild((n) => n.name === 'iOS · Home indicator'); if (hi) hi.y = f.height - hi.height;
}
// labels
const lab = (x, t) => { const l = mark(T(t, { size: 28, lh: 36, style: 'Bold' })); sec.appendChild(l); l.x = x; l.y = 80; };
lab(X0, 'Варіант A · фото в кожній картці'); lab(X0 + 2190, 'Варіант B · велике фото + прайс-лист');
const baseH = baseD.findChild ? 0 : 0;
sec.resizeWithoutConstraints(X0 + 2190 + 1560 + 390 + 120, Math.max(...sec.children.map((c) => c.y + c.height)) + 120);
return out;
