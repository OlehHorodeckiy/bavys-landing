// Game page: make «Деталі гри» a 4×2 tile grid and the rules card a step list, so the two blocks stop looking alike.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const page = await N('1518:139'), about = await N('1518:140'), det = await N('1518:222'), specs = await N('1518:227');
  // backup of both blocks in «Варіанти на вибір»
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'game-backup')) n.remove();
  const bk = figma.createFrame(); vsec.appendChild(bk); bk.name = 'Сторінка гри · «Що це за гра» і «Деталі» до змін (резерв)';
  bk.setPluginData('bavys-import', 'game-backup'); bk.fills = [];
  const a2 = about.clone(), d2 = det.clone(); bk.appendChild(a2); bk.appendChild(d2); a2.x = 0; a2.y = 0; d2.x = 0; d2.y = a2.height;
  bk.resize(1440, a2.height + d2.height);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== bk).map(n => n.x + n.width));
  bk.x = right + 160; bk.y = 866; vsec.resizeWithoutConstraints(bk.x + 1440 + 200, vsec.height);

  // 1) rules card: big terracotta numbers, no dividers
  const rules = await N('1518:164');
  for (const it of rules.children.filter(c => c.name === 'rules__item')) {
    it.strokes = [];
    const no = it.children.find(c => c.name === 'rules__no'); no.fills = [];
    const t = no.findOne(n => n.type === 'TEXT'); t.fontName = { family: 'Comfortaa', style: 'Light' }; t.fontSize = 32; t.lineHeight = { unit: 'PIXELS', value: 40 };
    t.fills = solid('#c78460'); t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = 0; t.y = 2;
  }
  for (const c of rules.children.filter(c => c.type === 'LINE' || (c.type === 'VECTOR' && c.width > 200))) c.remove();

  // 2) details: 4×2 tiles of icon / label / value on the dark section
  const rows = specs.children.filter(c => c.name === 'specs__row');
  const loose = specs.children.filter(c => c.name !== 'specs__row'); // last two specs are loose nodes (icon, label, value)
  const data = rows.map(r => ({ icon: r.children.find(c => c.name === 'specs__icon'), texts: r.findAll(n => n.type === 'TEXT') }));
  const looseIcons = loose.filter(c => c.name === 'specs__icon'), looseTexts = loose.filter(c => c.type === 'TEXT');
  for (let k = 0; k < looseIcons.length; k++) data.push({ icon: looseIcons[k], texts: [looseTexts[k * 2], looseTexts[k * 2 + 1]] });
  // order: short facts first, long ones last
  const order = ['Кількість гравців', 'Надворі / у приміщенні', 'Отримання', 'Застава', 'Термін оренди', 'Комплектація', 'Вартість оренди', 'Інструктор на події'];
  data.sort((a, b) => order.indexOf(a.texts[0].characters) - order.indexOf(b.texts[0].characters));
  const grid = figma.createFrame(); det.appendChild(grid); grid.name = 'specs-tiles'; grid.fills = [];
  grid.x = 80; grid.y = specs.y; const TW = 308, GAP = 16;
  const tiles = data.map((d, i) => {
    const t = figma.createFrame(); grid.appendChild(t); t.name = 'tile · ' + d.texts[0].characters;
    t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.06 }]; t.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }]; t.strokeWeight = 1; t.strokeAlign = 'INSIDE';
    t.cornerRadius = 20; t.layoutMode = 'VERTICAL'; t.itemSpacing = 8; t.paddingTop = t.paddingBottom = t.paddingLeft = t.paddingRight = 24;
    t.primaryAxisSizingMode = 'AUTO'; t.counterAxisSizingMode = 'FIXED'; t.resize(TW, 100);
    const ic = d.icon.clone(); t.appendChild(ic); ic.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.1 }];
    for (const v of ic.findAll(n => n.type === 'VECTOR')) { if (v.strokes.length) v.strokes = solid('#efc6a8'); if (v.fills.length) v.fills = solid('#efc6a8'); }
    const sp = figma.createFrame(); t.appendChild(sp); sp.fills = []; sp.resize(10, 8); sp.name = 'gap';
    const label = d.texts[0].clone(); t.appendChild(label); label.characters = label.characters === 'Надворі / у приміщенні' ? 'Де грати' : label.characters;
    label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.66 }]; label.fontSize = 14; label.lineHeight = { unit: 'PIXELS', value: 20 };
    label.textAutoResize = 'HEIGHT'; label.layoutSizingHorizontal = 'FILL';
    const val = d.texts[1].clone(); t.appendChild(val); val.fills = solid('#ffffff'); val.fontSize = 18; val.lineHeight = { unit: 'PIXELS', value: 28 };
    val.textAutoResize = 'HEIGHT'; val.layoutSizingHorizontal = 'FILL';
    return t;
  });
  // equal heights per row
  for (let r = 0; r < 2; r++) {
    const rowT = tiles.slice(r * 4, r * 4 + 4); const h = Math.ceil(Math.max(...rowT.map(t => t.height)) / 2) * 2;
    rowT.forEach((t, i) => { t.primaryAxisSizingMode = 'FIXED'; t.resize(TW, h); t.x = i * (TW + GAP); t.y = r === 0 ? 0 : tiles[0].height + GAP; });
  }
  grid.resize(1280, tiles[4].y + tiles[4].height);
  specs.remove();
  const oldH = det.height; det.resize(1440, Math.ceil((grid.y + grid.height + 80) / 2) * 2);
  const d = det.height - oldH; for (const c of page.children) if (c !== det && c.y > det.y) c.y += d; page.resize(1440, page.height + d);
  return JSON.stringify({ tiles: tiles.map(t => t.name.slice(7) + ' ' + t.height), det: det.height, page: page.height, backup: bk.x });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
