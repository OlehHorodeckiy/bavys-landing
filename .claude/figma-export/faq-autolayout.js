for (const st of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: st });
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
function toggle(parent, open, d, x, y) {
  const c = figma.createFrame(); parent.appendChild(c); c.name = open ? 'faq__toggle · відкрито' : 'faq__toggle';
  c.resize(d, d); c.cornerRadius = d / 2; c.x = x; c.y = y; c.fills = solid(open ? C.primary : C.cream);
  const col = open ? C.white : C.deep; const L = Math.round(d * 0.36 / 2) * 2;
  const h = figma.createRectangle(); c.appendChild(h); h.resize(L, 2); h.x = (d - L) / 2; h.y = d / 2 - 1; h.cornerRadius = 1; h.fills = solid(col); h.name = '—';
  if (!open) { const v = figma.createRectangle(); c.appendChild(v); v.resize(2, L); v.x = d / 2 - 1; v.y = (d - L) / 2; v.cornerRadius = 1; v.fills = solid(col); v.name = '|'; }
  return c;
}

function AL(dir, props) { const f = figma.createFrame(); f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; Object.assign(f, props); return f; }
function dashFrame(f, top) {
  f.strokes = solid(C.dash); f.dashPattern = [4, 4]; f.strokeAlign = 'INSIDE';
  f.strokeTopWeight = top ? 1 : 0; f.strokeBottomWeight = top ? 0 : 1; f.strokeLeftWeight = 0; f.strokeRightWeight = 0;
  f.strokesIncludedInLayout = true;
}
// accordion as auto-layout: list (top dash) > items (bottom dash, padding pad, gap 12) > question row + answer
function list(w, o) {
  const box = AL('VERTICAL', { name: 'faq__list', itemSpacing: 0 }); box.fills = []; box.clipsContent = false;
  dashFrame(box, true); box.counterAxisSizingMode = 'FIXED'; box.resize(w, box.height);
  FAQ.forEach(([q, a], i) => {
    const open = i === 0;
    const it = AL('VERTICAL', { name: 'faq__item' + (open ? ' · відкрито' : ''), itemSpacing: o.ga }); box.appendChild(it);
    it.fills = []; it.clipsContent = false; it.paddingTop = o.pad; it.paddingBottom = o.pad; dashFrame(it, false);
    it.layoutSizingHorizontal = 'FILL';
    const row = AL('HORIZONTAL', { name: 'faq__q' }); it.appendChild(row);
    row.fills = []; row.clipsContent = false; row.paddingRight = o.d + o.gap; row.layoutSizingHorizontal = 'FILL';
    const qt = text(row, q, o.q[0], o.q[1], 'Bold', C.deep); qt.name = 'питання'; qt.layoutSizingHorizontal = 'FILL'; qt.textAutoResize = 'HEIGHT';
    const tg = toggle(row, open, o.d, 0, 0); tg.layoutPositioning = 'ABSOLUTE'; tg.constraints = { horizontal: 'MAX', vertical: 'MIN' };
    tg.x = w - o.d; tg.y = Math.round((o.q[1] - o.d) / 2);
    if (open) {
      const at = text(it, nb(a), o.a[0], o.a[1], 'Medium', C.ink); at.name = 'відповідь';
      if (o.fullAnswer) { at.layoutSizingHorizontal = 'FILL'; at.textAutoResize = 'HEIGHT'; } else { at.textAutoResize = 'HEIGHT'; at.resize(w - o.d - o.gap, at.height); }
    }
  });
  return box;
}
const OPTS = { D: { q: [22, 30], a: [18, 30], d: 44, gap: 40, pad: 28, ga: 12 }, M: { q: [18, 26], a: [16, 26], d: 36, gap: 24, pad: 20, ga: 12, fullAnswer: true } };
const out = [];
for (const fid of ['1586:374', '1586:432', '1586:490', '1586:548']) {
  const faq = await figma.getNodeByIdAsync(fid); const page = faq.parent;
  const old = faq.findChild(n => n.name === 'faq__list');
  const o = faq.width > 1000 ? OPTS.D : OPTS.M;
  const nl = list(old.width, o); faq.appendChild(nl); nl.x = old.x; nl.y = old.y;
  const dy = Math.round(nl.height - old.height), oldBottom = old.y + old.height;
  old.remove();
  if (o === OPTS.M) for (const c of faq.children) if (c !== nl && c.y >= oldBottom - 1) c.y += dy;
  const newH = Math.max(...faq.children.map(c => c.y + c.height)) + (o === OPTS.M ? 64 : 80);
  const dF = Math.round(newH - faq.height);
  const faqBottom = faq.y + faq.height;
  faq.resizeWithoutConstraints(faq.width, newH);
  if (dF) { for (const c of page.children) if (c !== faq && c.y >= faqBottom - 1) c.y += dF; page.resizeWithoutConstraints(page.width, page.height + dF); }
  out.push([page.name, nl.id, 'list', Math.round(nl.height), 'dy', dy, 'faq', faq.height, 'page', page.height]);
}
return out;
