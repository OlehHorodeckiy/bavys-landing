// «Часті питання»: a new block for the home and game pages, desktop 1440 + iPhone 390,
// placed in «Варіанти на вибір» (x 21000). Answers only from the site's real rental terms.
for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
const sec = await figma.getNodeByIdAsync('1518:1089');
for (const old of sec.children.filter((c) => c.getPluginData('faq'))) old.remove();
const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
const C = { deep: '#2b1003', primary: '#866452', ink: '#6b584e', accent: '#c78460', cream: '#f9f6f3', dash: '#d8cfc6', white: '#ffffff' };

const FAQ = [
  ['Скільки коштує оренда ігор?', 'Одна гра коштує 800 грн на добу. Що більше ігор, то вигідніше: 2 гри 1550 грн, 3 гри 2300 грн, 4 гри 3000 грн, кожна наступна 750 грн.'],
  ['На скільки часу можна взяти гру?', 'На добу: з дня отримання до наступного дня включно. Повернути гру треба наступного дня до 12:00.'],
  ['Як ігри потрапляють на свято?', 'Привозимо ігри по Львову та області, розставляємо, пояснюємо правила і забираємо після свята. Можна забрати й самостійно зі складу за попереднім записом.'],
  ['Чи потрібна передоплата або застава?', 'Передоплати немає. Застава є, її сума залежить від кількості ігор: адміністратор назве її, коли підтверджуватиме бронь.'],
  ['Чи може хтось провести ігри на святі?', 'Так, на подію можна замовити інструктора: 400 грн на годину, від 3 годин.'],
  ['Ігри підходять для приміщення?', 'Так, усі наші ігри можна ставити і надворі, і в приміщенні. Для Великої Дженги на плитці чи асфальті безкоштовно даємо м’яку підкладку.'],
  ['Як забронювати ігри?', 'Залиште заявку на сайті або зателефонуйте: +38 (063) 993-16-76. Адміністратор зателефонує протягом доби, уточнить дату й ігри та зафіксує бронь.'],
];

const nb = (s) => s.replace(/(\d) (?=[а-яіїєґa-z\d])/gi, '$1\u00a0');

function text(parent, chars, size, lh, style, color, x, y, w, align) {
  const t = figma.createText(); parent.appendChild(t);
  t.fontName = { family: 'Comfortaa', style }; t.characters = chars; t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color);
  if (align) t.textAlignHorizontal = align;
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (x !== undefined) { t.x = x; t.y = y; }
  return t;
}
function title(parent, a, b, size, lh, x, y, w, align) {
  const t = text(parent, `${a}\n${b}`, size, lh, 'Bold', C.deep, x, y, w, align);
  t.setRangeFontName(a.length + 1, a.length + 1 + b.length, { family: 'Comfortaa', style: 'Light' });
  t.setRangeFills(a.length + 1, a.length + 1 + b.length, solid(C.primary));
  t.name = `${a} ${b}`; return t;
}
function pill(parent, label, bg) {
  const p = figma.createFrame(); parent.appendChild(p); p.name = 'pill';
  p.layoutMode = 'HORIZONTAL'; p.primaryAxisSizingMode = 'AUTO'; p.counterAxisSizingMode = 'AUTO'; p.counterAxisAlignItems = 'CENTER';
  p.itemSpacing = 8; p.paddingTop = p.paddingBottom = 8; p.paddingLeft = p.paddingRight = 16; p.cornerRadius = 15; p.fills = solid(bg);
  const d = figma.createEllipse(); p.appendChild(d); d.resize(6, 6); d.fills = solid(C.deep); d.name = 'pill__dot';
  const t = text(p, label.toUpperCase(), 12, 14, 'Bold', C.deep); t.letterSpacing = { unit: 'PERCENT', value: 8 };
  return p;
}
function dashed(parent, x, y, w) {
  const l = figma.createLine(); parent.appendChild(l); l.name = 'dash'; l.resize(w, 0); l.x = x; l.y = y;
  l.strokes = solid(C.dash); l.strokeWeight = 1; l.dashPattern = [4, 4]; return l;
}
function toggle(parent, open, d, x, y) {
  const c = figma.createFrame(); parent.appendChild(c); c.name = open ? 'faq__toggle · відкрито' : 'faq__toggle';
  c.resize(d, d); c.cornerRadius = d / 2; c.x = x; c.y = y; c.fills = solid(open ? C.primary : C.cream);
  const col = open ? C.white : C.deep; const L = Math.round(d * 0.36 / 2) * 2;
  const h = figma.createRectangle(); c.appendChild(h); h.resize(L, 2); h.x = (d - L) / 2; h.y = d / 2 - 1; h.cornerRadius = 1; h.fills = solid(col); h.name = '—';
  if (!open) { const v = figma.createRectangle(); c.appendChild(v); v.resize(2, L); v.x = d / 2 - 1; v.y = (d - L) / 2; v.cornerRadius = 1; v.fills = solid(col); v.name = '|'; }
  return c;
}
// the accordion: question rows between dashed lines, the first one open
function list(parent, x, y, w, o) {
  const box = figma.createFrame(); parent.appendChild(box); box.name = 'faq__list'; box.fills = []; box.clipsContent = false; box.x = x; box.y = y;
  let cy = 0; dashed(box, 0, cy, w);
  FAQ.forEach(([q, a], i) => {
    const open = i === 0;
    const row = figma.createFrame(); box.appendChild(row); row.name = `faq__item${open ? ' · відкрито' : ''}`; row.fills = []; row.x = 0; row.y = cy;
    const qt = text(row, q, o.q[0], o.q[1], 'Bold', C.deep, 0, o.pad, w - o.d - o.gap);
    let bottom = qt.y + qt.height;
    if (open) { const at = text(row, nb(a), o.a[0], o.a[1], 'Medium', C.ink, 0, bottom + o.ga, o.fullAnswer ? w : w - o.d - o.gap); bottom = at.y + at.height; }
    const tg = toggle(row, open, o.d, w - o.d, o.pad + Math.round((o.q[1] - o.d) / 2));
    const h = bottom + o.pad; row.resize(w, h);
    cy += h; dashed(box, 0, cy, w);
  });
  box.resize(w, cy); return box;
}
function primaryBtn(parent, label, x, y, w) {
  const b = figma.createFrame(); parent.appendChild(b); b.name = 'btn'; b.cornerRadius = 26; b.fills = solid(C.primary);
  const t = text(b, label, 16, 18, 'Bold', C.white, 24, 17); t.name = 'btn__label';
  const W = w || 24 + Math.ceil(t.width) + 16 + 38 + 8 + (Math.ceil(t.width) % 2);
  b.resize(W, 52); b.x = x; b.y = y;
  const disc = figma.createFrame(); b.appendChild(disc); disc.name = 'btn__disc'; disc.resize(38, 38); disc.cornerRadius = 19; disc.fills = solid(C.white); disc.x = W - 7 - 38; disc.y = 7;
  const arrow = figma.createVector(); disc.appendChild(arrow); arrow.name = 'arrow ↗';
  arrow.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 8 L 8 0 M 2 0 L 8 0 L 8 6' }];
  arrow.strokes = solid(C.deep); arrow.strokeWeight = 1.8; arrow.strokeCap = 'ROUND'; arrow.strokeJoin = 'ROUND'; arrow.fills = []; arrow.x = 15; arrow.y = 15;
  return b;
}
async function phone(parent, x, y, color, center, w) {
  const src = await figma.getNodeByIdAsync('1554:13001');
  const a = src.clone(); parent.appendChild(a); a.name = 'a · телефон';
  const t = a.findOne((n) => n.type === 'TEXT'); t.fills = solid(color); t.fontName = { family: 'Comfortaa', style: 'Bold' };
  for (const v of a.findAll((n) => n.type === 'VECTOR')) { if (v.strokes.length) v.strokes = solid(C.accent); if (v.fills.length) v.fills = solid(C.accent); }
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  const width = 28 + Math.ceil(t.width) + (Math.ceil(t.width) % 2); a.resize(width, 28);
  a.x = center ? Math.round((w - width) / 2) : x; a.y = y; return a;
}
function label(x, t1, t2, t3) {
  const f = figma.createFrame(); sec.appendChild(f); f.setPluginData('faq', '1'); f.name = `Підпис — ${t1}`; f.fills = [];
  f.layoutMode = 'VERTICAL'; f.itemSpacing = 16; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'FIXED'; f.resize(1440, 100);
  const a = text(f, t1, 56, 72, 'Bold', C.deep); const b = text(f, t2, 28, 36, 'Regular', C.accent); const c = text(f, t3, 28, 36, 'Regular', C.ink);
  for (const n of [a, b, c]) { n.layoutAlign = 'STRETCH'; n.textAutoResize = 'HEIGHT'; }
  f.x = x; f.y = 866 - 40 - f.height;
}

// ---------------------------------------------------------------- desktop 1440
const D = figma.createFrame(); sec.appendChild(D); D.setPluginData('faq', '1'); D.name = 'Часті питання — 1440'; D.fills = solid(C.white); D.x = 21000; D.y = 866; D.resize(1440, 100);
const p1 = pill(D, 'Питання й відповіді', C.cream); p1.x = 80; p1.y = 80;
const t1 = title(D, 'Часті', 'питання', 48, 56, 80, p1.y + p1.height + 20, 440);
const x1 = text(D, 'Не знайшли відповіді? Зателефонуйте або залиште заявку: адміністратор зв’яжеться з вами протягом доби.', 18, 30, 'Medium', C.ink, 80, t1.y + t1.height + 24, 400);
const b1 = primaryBtn(D, 'Поставити питання', 80, x1.y + x1.height + 40);
const ph1 = await phone(D, 80, b1.y + 52 + 24, C.deep);
const l1 = list(D, 600, 80, 760, { q: [22, 30], a: [18, 30], d: 44, gap: 40, pad: 28, ga: 12 });
D.resize(1440, Math.max(ph1.y + 28, l1.y + l1.height) + 80);

// ------------------------------------------------------------------ mobile 390
const M = figma.createFrame(); sec.appendChild(M); M.setPluginData('faq', '1'); M.name = 'Часті питання — 390'; M.fills = solid(C.white); M.x = 22600; M.y = 866; M.resize(390, 100);
const p2 = pill(M, 'Питання й відповіді', C.cream); p2.x = Math.round((390 - p2.width) / 2); p2.y = 64;
const t2 = title(M, 'Часті', 'питання', 30, 36, 20, p2.y + p2.height + 16, 350, 'CENTER');
const x2 = text(M, 'Не знайшли відповіді? Зателефонуйте або залиште заявку: адміністратор зв’яжеться з вами протягом доби.', 18, 30, 'Medium', C.ink, 20, t2.y + t2.height + 16, 350, 'CENTER');
const l2 = list(M, 20, x2.y + x2.height + 40, 350, { q: [18, 26], a: [16, 26], d: 36, gap: 24, pad: 20, ga: 12, fullAnswer: true });
const b2 = primaryBtn(M, 'Поставити питання', 20, l2.y + l2.height + 40, 350);
const ph2 = await phone(M, 0, b2.y + 52 + 24, C.deep, true, 390);
M.resize(390, ph2.y + 28 + 64);

label(21000, 'Часті питання (новий блок)', 'Головна: після «Для яких подій»; сторінка гри: після «Деталі гри». Ліворуч 1440, праворуч 390', 'Відповіді лише з реальних умов оренди: ціни, доба, доставка, застава, інструктор, бронювання. Перше питання відкрите, решта згорнуті (+). Кнопка відкриває попап бронювання');
return JSON.stringify({ desktop: [D.id, D.height], mobile: [M.id, M.height] });
