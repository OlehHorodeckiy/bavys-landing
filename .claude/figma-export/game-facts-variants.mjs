// Three ways to show the game facts without the plate on the grass (Figma-first study).
const code = `
  for (const s of ['Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', MUTED = '#9a8a80', ACC = '#c78460', INK = '#6b584e';
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'game-facts' || n.getPluginData('bavys-label') === 'game-facts')) n.remove();
  const hero0 = await N('1518:444'), header0 = (await N('1518:139')).children.find(c => c.name === 'site-header');
  const items = await N('1518:462');
  const icons = [await N('1518:463'), ...items.children.filter(c => c.name === 'facts__item').map(c => c.findOne(n => n.name === 'icon'))];
  const LABELS = ['Гравців', 'Оренда', 'Термін', 'Де грати'];
  const VALUES = ['2+', '800 грн / доба', 'доба', 'Надворі й у приміщенні'];
  const CHIPS = ['2+ гравців', '800 грн / доба', 'Оренда на добу', 'Надворі й у приміщенні'];
  const text = (parent, chars, size, lh, style, color, x, y) => {
    const t = figma.createText(); parent.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars;
    t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t;
  };
  const icon = (parent, i, x, y, color) => { const c = icons[i].clone(); parent.appendChild(c); c.x = x; c.y = y;
    for (const v of c.findAll(n => n.type === 'VECTOR')) { if (v.strokes.length) v.strokes = solid(color); if (v.fills.length) v.fills = solid(color); } return c; };
  const W = 1440;
  const wrap = figma.createFrame(); vsec.appendChild(wrap); wrap.name = 'Сторінка гри · факти — 3 варіанти (A, B, C)';
  wrap.setPluginData('bavys-import', 'game-facts'); wrap.fills = solid('#ffffff');
  let y = 0;
  const bar = (txt) => { const f = figma.createFrame(); wrap.appendChild(f); f.name = 'lab__label'; f.resize(W, 80); f.y = y; f.fills = solid(DEEP);
    text(f, txt, 20, 32, 'Bold', '#ffffff', 80, 24); y += 80; };
  const heroCopy = () => { const h = hero0.clone(); wrap.appendChild(h); h.x = 0; h.y = y;
    const hd = header0.clone(); h.appendChild(hd); hd.x = 0; hd.y = 0;
    h.children.find(c => c.name === 'facts').remove(); y += h.height; return h; };
  const left = (h) => h.children.filter(c => c.x < 700 && c.name !== 'site-header');

  // A · 2×2 list under the buttons, left column lifted
  bar('Сторінка гри · A · Факти списком 2×2 під кнопками, без плашки');
  const A = heroCopy(); for (const c of left(A)) c.y -= 48;
  const btnA = A.children.find(c => c.name === 'btn'); const y0 = btnA.y + btnA.height + 40;
  LABELS.forEach((l, i) => { const x = 80 + (i % 2) * 280, yy = y0 + Math.floor(i / 2) * 64;
    icon(A, i, x, yy + 2, ACC); text(A, l, 14, 20, 'Medium', MUTED, x + 24, yy); text(A, VALUES[i], 18, 24, 'Bold', DEEP, x, yy + 24); });

  // B · one meta line with icons between the text and the buttons
  bar('Сторінка гри · B · Один рядок фактів з іконками між текстом і кнопками');
  const B = heroCopy();
  const body = B.children.find(c => c.type === 'TEXT' && c.fontSize === 20);
  const metaY = body.y + body.height + 24;
  for (const c of B.children.filter(c => c.name === 'btn')) c.y += 48;
  const meta = figma.createFrame(); B.appendChild(meta); meta.name = 'facts-line'; meta.fills = []; meta.x = 80; meta.y = metaY;
  meta.layoutMode = 'HORIZONTAL'; meta.itemSpacing = 24; meta.counterAxisAlignItems = 'CENTER'; meta.primaryAxisSizingMode = 'AUTO'; meta.counterAxisSizingMode = 'AUTO';
  CHIPS.forEach((v, i) => { const it = figma.createFrame(); meta.appendChild(it); it.fills = []; it.layoutMode = 'HORIZONTAL'; it.itemSpacing = 8;
    it.counterAxisAlignItems = 'CENTER'; it.primaryAxisSizingMode = 'AUTO'; it.counterAxisSizingMode = 'AUTO';
    const ic = icons[i].clone(); it.appendChild(ic); for (const vv of ic.findAll(n => n.type === 'VECTOR')) { if (vv.strokes.length) vv.strokes = solid(ACC); if (vv.fills.length) vv.fills = solid(ACC); }
    const t = figma.createText(); it.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = v; t.fontSize = 14; t.lineHeight = { unit: 'PIXELS', value: 20 }; t.fills = solid(INK); });

  // C · glass chips on the game photo
  bar('Сторінка гри · C · Факти скляними чипами на фото гри');
  const C = heroCopy();
  const stage = C.children.find(c => c.name === 'hero-product__stage');
  const wrapChips = figma.createFrame(); stage.appendChild(wrapChips); wrapChips.name = 'facts-chips'; wrapChips.fills = [];
  wrapChips.layoutMode = 'HORIZONTAL'; wrapChips.layoutWrap = 'WRAP'; wrapChips.itemSpacing = 8; wrapChips.counterAxisSpacing = 8;
  wrapChips.primaryAxisSizingMode = 'FIXED'; wrapChips.counterAxisSizingMode = 'AUTO'; wrapChips.resize(stage.width - 48, 10); wrapChips.counterAxisSizingMode = 'AUTO';
  CHIPS.forEach((v, i) => { const ch = figma.createFrame(); wrapChips.appendChild(ch); ch.name = 'chip · ' + v;
    ch.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.84 }]; ch.effects = [{ type: 'BACKGROUND_BLUR', radius: 16, visible: true }];
    ch.cornerRadius = 18; ch.layoutMode = 'HORIZONTAL'; ch.itemSpacing = 8; ch.paddingLeft = 14; ch.paddingRight = 14; ch.paddingTop = 8; ch.paddingBottom = 8;
    ch.counterAxisAlignItems = 'CENTER'; ch.primaryAxisSizingMode = 'AUTO'; ch.counterAxisSizingMode = 'AUTO';
    const ic = icons[i].clone(); ch.appendChild(ic); for (const vv of ic.findAll(n => n.type === 'VECTOR')) { if (vv.strokes.length) vv.strokes = solid(ACC); if (vv.fills.length) vv.fills = solid(ACC); }
    const t = figma.createText(); ch.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = v; t.fontSize = 14; t.lineHeight = { unit: 'PIXELS', value: 20 }; t.fills = solid(DEEP); });
  wrapChips.x = 24; await new Promise(r => setTimeout(r, 50)); wrapChips.y = stage.height - 24 - wrapChips.height;

  wrap.resize(W, y);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== wrap).map(n => n.x + n.width));
  wrap.x = right + 160; wrap.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'game-facts'); lab.name = 'Підпис — Сторінка гри, факти';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '07  Сторінка гри · факти — 3 варіанти';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Перший екран «03 Сторінка гри» без плашки на траві (тільки у Фігмі)';
  ts[2].characters = 'A · список 2×2 під кнопками, B · рядок фактів з іконками над кнопками, C · скляні чипи на фото гри';
  lab.x = wrap.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(wrap.x + W + 200, Math.max(vsec.height, 866 + y + 200));
  figma.viewport.scrollAndZoomIntoView([wrap]);
  return JSON.stringify({ id: wrap.id, x: wrap.x, h: y });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
