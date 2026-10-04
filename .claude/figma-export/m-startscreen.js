// «12 Стартовий екран» (as the phone shows the home page on open, with the pinned bottom bar)
// and «13 … + Instagram» (proposal: an Instagram circle next to «Забронювати»).
for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
const sec = await figma.getNodeByIdAsync('1554:20267');
const home = await figma.getNodeByIdAsync('1554:12480');
const N = (id) => figma.getNodeByIdAsync(id);
const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, o) => [{ type: 'SOLID', color: rgb(h), opacity: o ?? 1 }];
const IG = 'https://www.instagram.com/bavys.lviv?stkn=MWFzN2VhMXcwY2Q3YQ%3D%3D';
for (const old of sec.children.filter((c) => c.getPluginData('start-screen'))) old.remove();

const footer = home.children.find((c) => c.name === 'site-footer');
const igIcon = footer.children.find((c) => c.name === 'icon-btn').children.find((c) => c.name === 'icon');
const heroBtn = await N('1554:25492');

const label = (x, t1, t2) => {
  const a = figma.createText(); sec.appendChild(a); a.fontName = { family: 'Comfortaa', style: 'Bold' }; a.characters = t1; a.fontSize = 28; a.lineHeight = { unit: 'PIXELS', value: 36 }; a.fills = solid('#2b1003'); a.x = x; a.y = 560; a.resize(390, 36); a.textAutoResize = 'HEIGHT'; a.setPluginData('start-screen', '1');
  const b = figma.createText(); sec.appendChild(b); b.fontName = { family: 'Comfortaa', style: 'Regular' }; b.characters = t2; b.fontSize = 18; b.lineHeight = { unit: 'PIXELS', value: 24 }; b.fills = solid('#c78460'); b.x = x; b.y = 604; b.resize(390, 24); b.textAutoResize = 'HEIGHT'; b.setPluginData('start-screen', '1');
};
const outlineBtn = (w, text) => {
  const f = figma.createFrame(); f.name = 'btn · outline'; f.resize(w, 50); f.cornerRadius = 25; f.fills = []; f.strokes = solid('#866452'); f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
  const t = figma.createText(); f.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = text; t.fontSize = 16; t.lineHeight = { unit: 'PIXELS', value: 18 }; t.fills = solid('#866452'); t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.x = Math.round((w - t.width) / 2); t.y = 16; return f;
};
const primaryBtn = (w, text) => {
  const f = heroBtn.clone(); f.name = 'btn · primary'; f.resize(w, 50); f.cornerRadius = 25;
  const disc = f.children.find((c) => c.name === 'btn__disc'); disc.x = w - 6 - 38; disc.y = 6;
  const lab = f.children.find((c) => c.name === 'btn__label'); const t = lab.findOne((n) => n.type === 'TEXT'); t.characters = text; lab.x = 20; lab.y = 16;
  return f;
};

async function screen(x, withIg) {
  const fr = figma.createFrame(); sec.appendChild(fr); fr.setPluginData('start-screen', '1');
  fr.name = withIg ? '13 Стартовий екран + Instagram — 390' : '12 Стартовий екран — 390';
  fr.resize(390, 844); fr.x = x; fr.y = 672; fr.clipsContent = true; fr.fills = solid('#ffffff');
  for (const nm of ['hero', 'site-header', 'iOS · status bar bg', 'iOS · Status bar', 'iOS · Home indicator']) {
    const src = home.children.find((c) => c.name === nm); const k = src.clone(); fr.appendChild(k); k.x = src.x; k.y = src.y;
    if (nm === 'iOS · Home indicator') { k.y = 810; for (const r of k.findAll((n) => n.type === 'RECTANGLE')) r.fills = solid('#1a1a1a'); }
  }
  // pinned bar: 12 from the sides, 12 above the home indicator (safe area 34)
  const bar = figma.createFrame(); bar.name = 'mobile-bar · закріплена'; fr.insertChild(fr.children.length - 1, bar);
  bar.resize(366, 66); bar.x = 12; bar.y = 844 - 34 - 12 - 66; bar.cornerRadius = 20; bar.fills = solid('#ffffff', 0.97); bar.clipsContent = false;
  bar.effects = [{ type: 'DROP_SHADOW', color: { r: 43 / 255, g: 16 / 255, b: 3 / 255, a: 0.2 }, offset: { x: 0, y: 12 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const W = withIg ? [84, 200] : [126, 216];
  const a = outlineBtn(W[0], 'Ігри'); bar.appendChild(a); a.x = 8; a.y = 8;
  const b = primaryBtn(W[1], 'Забронювати'); bar.appendChild(b); b.x = 8 + W[0] + 8; b.y = 8;
  if (withIg) {
    const c = figma.createFrame(); bar.appendChild(c); c.name = 'btn · instagram'; c.resize(50, 50); c.cornerRadius = 25; c.fills = []; c.strokes = solid('#866452'); c.strokeWeight = 1; c.strokeAlign = 'INSIDE';
    c.x = 366 - 8 - 50; c.y = 8;
    const ic = igIcon.clone(); c.appendChild(ic); ic.resize(20, 20); ic.x = 15; ic.y = 15;
    for (const v of ic.findAll((n) => 'strokes' in n)) { if (v.strokes.length) v.strokes = solid('#866452'); if (v.fills && v.fills.length && v.type !== 'FRAME') v.fills = solid('#866452'); }
    try { await c.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'URL', url: IG }] }]); } catch (e) {}
  }
  return fr;
}
await screen(5810, false); label(5810, '12 Стартовий екран', 'головна при відкритті, як бачить телефон');
const f13 = await screen(6320, true); label(6320, '13 Стартовий екран + Instagram', 'пропозиція: Instagram біля «Забронювати»');
sec.resizeWithoutConstraints(6910, sec.height);
const sub = sec.children.find((c) => c.type === 'TEXT' && c.characters.startsWith('iPhone 390')); sub.characters = 'iPhone 390 · 13 екранів · оновлено 4 жовтня 2026';
// Instagram links: footer icon buttons (prototype link) and @bavys.lviv texts
let n = 0;
for (const ft of figma.currentPage.findAll((x) => x.name === 'site-footer' && x.type === 'FRAME')) {
  const ib = ft.children.find((c) => c.name === 'icon-btn'); if (!ib) continue;
  try { await ib.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'URL', url: IG }] }]); n++; } catch (e) {}
}
for (const t of figma.currentPage.findAll((x) => x.type === 'TEXT' && x.characters === '@bavys.lviv')) t.hyperlink = { type: 'URL', value: IG };
return 'ok ' + f13.id + ' footers ' + n;
