// Alternative «Про нас»: light, shorter. Title → photo strip → story + real facts → what's included (6 tiles) → CTA → footer.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', CREAM = '#f9f6f3';
  const about = await N('1511:34538'), vsec = await N('1518:1089'), cat = await N('1510:33541');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'about-alt' || n.getPluginData('bavys-label') === 'about-alt')) n.remove();
  const home = vsec.parent.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === 'home')[0];
  const gal = (start) => home.findOne(n => n.type === 'RECTANGLE' && n.name.startsWith(start)).fills.find(f => f.type === 'IMAGE');
  const text = (parent, chars, size, lh, style, color, x, y, w, align) => {
    const t = figma.createText(); parent.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars;
    t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); if (align) t.textAlignHorizontal = align;
    if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t;
  };
  const accent = (t, from, style = 'Light') => { t.setRangeFontName(from, t.characters.length, { family: 'Comfortaa', style }); t.setRangeFills(from, t.characters.length, solid(PRI)); };
  const sec = (parent, name, y, fill) => { const s = figma.createFrame(); parent.appendChild(s); s.name = name; s.fills = solid(fill); s.x = 0; s.y = y; s.resize(1440, 100); return s; };
  const pill = (parent, label, x, y, fill) => {
    const p = figma.createFrame(); parent.appendChild(p); p.name = 'pill'; p.fills = solid(fill); p.cornerRadius = 16;
    p.layoutMode = 'HORIZONTAL'; p.itemSpacing = 8; p.paddingLeft = 16; p.paddingRight = 16; p.counterAxisAlignItems = 'CENTER';
    p.resize(10, 32); p.primaryAxisSizingMode = 'AUTO'; p.counterAxisSizingMode = 'FIXED';
    const d = figma.createEllipse(); p.appendChild(d); d.resize(6, 6); d.fills = solid(DEEP);
    const t = figma.createText(); p.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = label; t.fontSize = 12; t.lineHeight = { unit: 'PIXELS', value: 16 }; t.letterSpacing = { unit: 'PERCENT', value: 8 }; t.fills = solid(DEEP); t.textAutoResize = 'WIDTH_AND_HEIGHT';
    p.x = x === 'c' ? Math.round((1440 - p.width) / 4) * 2 : x; p.y = y; return p;
  };
  const f = figma.createFrame(); vsec.appendChild(f); f.name = 'Про нас — альтернативна версія'; f.setPluginData('bavys-import', 'about-alt'); f.fills = solid('#ffffff'); f.clipsContent = true;
  let y = 0;
  // 1 · title + photo strip
  const A = sec(f, 'about-intro', 0, '#ffffff');
  pill(A, 'ПРО КОМПАНІЮ', 'c', 160, CREAM);
  const t1 = text(A, 'Бавись — це про гру разом', 60, 64, 'Bold', DEEP, 0, 212, 1440, 'CENTER'); accent(t1, 'Бавись — це '.length);
  const p1 = text(A, 'Ми команда зі Львова, яка вірить, що найкращі свята там, де гості не сидять за столами, а грають, сміються і знайомляться.', 20, 34, 'Medium', INK, 340, t1.y + t1.height + 24, 760, 'CENTER');
  const ph = [gal('Гості біля шатра'), gal('Корнхол на газоні'), gal('Компанія грає за столом')];
  const py = p1.y + p1.height + 56;
  ph.forEach((fl, i) => { const r = figma.createRectangle(); A.appendChild(r); r.name = 'фото ' + (i + 1); r.resize(416, 416); r.x = 80 + i * 432; r.y = py; r.cornerRadius = 24; r.fills = [{ type: 'IMAGE', imageHash: fl.imageHash, scaleMode: 'FILL' }]; });
  A.resize(1440, py + 416 + 80); y += A.height;
  // 2 · story + facts
  const B = sec(f, 'about-story', y, CREAM);
  pill(B, 'НАША ІСТОРІЯ', 80, 80, '#ffffff');
  const t2 = text(B, 'Із любові\\nдо дерев’яних ігор', 48, 56, 'Bold', DEEP, 80, 132, 520); accent(t2, 'Із любові\\n'.length);
  const s1 = text(B, 'Бавись починався з кількох великих ігор, які ми робили для свят друзів. Гості не відходили від них до ночі, і ми зрозуміли, що це варто робити для всіх.', 18, 30, 'Medium', INK, 720, 80, 640);
  const s2 = text(B, 'Сьогодні в нашій колекції 16 дерев’яних ігор для дорослих і дітей. Ми дбаємо про кожну так, ніби вона їде на наше власне свято.', 18, 30, 'Medium', INK, 720, s1.y + s1.height + 16, 640);
  const facts = [['16', 'дерев’яних ігор у колекції'], ['800 грн', 'за гру на добу'], ['Львів', 'та область, з доставкою']];
  const fy = s2.y + s2.height + 48;
  facts.forEach(([v, l], i) => { const x = 720 + i * 224;
    text(B, v, 40, 48, 'Light', ACC, x, fy); text(B, l, 14, 20, 'Medium', MUTED, x, fy + 56, 200); });
  B.resize(1440, Math.ceil((Math.max(t2.y + t2.height, fy + 56 + 40) + 80) / 2) * 2); y += B.height;
  // 3 · what's included: 6 tiles
  const C = sec(f, 'about-service', y, '#ffffff');
  const t3 = text(C, 'Що входить в оренду', 48, 56, 'Bold', DEEP, 0, 80, 1440, 'CENTER'); accent(t3, 'Що входить '.length);
  const sub = text(C, 'Ви отримуєте не набір коробок, а готову ігрову зону.', 18, 28, 'Medium', INK, 0, t3.y + t3.height + 16, 1440, 'CENTER');
  const items = ['Доставка по Львову та області у зручний для локації час', 'Монтаж і розстановка ігрової зони під ваш простір', 'Пояснення правил гостям або адміністратор на місці',
                 'Чисті, відшліфовані ігри у фірмовому пакуванні', 'Демонтаж і вивіз після завершення свята', 'Один адміністратор на зв’язку від заявки до кінця свята'];
  const icons = ['1511:34622', '1511:34629', '1511:34636', '1511:34643', '1511:34650', '1511:34658'];
  const ty = sub.y + sub.height + 48; let tb = 0;
  for (let i = 0; i < 6; i++) {
    const x = 80 + (i % 3) * 432, yy = ty + Math.floor(i / 3) * 176;
    const tile = figma.createFrame(); C.appendChild(tile); tile.name = 'tile ' + (i + 1); tile.fills = solid(CREAM); tile.cornerRadius = 20; tile.resize(416, 160); tile.x = x; tile.y = yy;
    const circ = figma.createFrame(); tile.appendChild(circ); circ.resize(40, 40); circ.cornerRadius = 20; circ.fills = solid('#ffffff'); circ.x = 24; circ.y = 24;
    const ic = (await N(icons[i])).clone(); circ.appendChild(ic); ic.x = Math.round((40 - ic.width) / 2); ic.y = Math.round((40 - ic.height) / 2);
    for (const v of ic.findAll(n => n.type === 'VECTOR')) { if (v.strokes.length) v.strokes = solid(ACC); if (v.fills.length) v.fills = solid(ACC); }
    text(tile, items[i], 16, 26, 'Bold', DEEP, 24, 88, 368);
    tb = yy + 160;
  }
  C.resize(1440, tb + 80); y += C.height;
  // 4 · CTA + footer from the real page; light header
  for (const name of ['cta-section', 'site-footer']) { const c = about.children.find(k => k.name === name).clone(); f.appendChild(c); c.x = 0; c.y = y; y += c.height; }
  const hd = cat.children.find(c => c.name === 'site-header').clone(); f.appendChild(hd); hd.x = 0; hd.y = 0;
  const links = hd.findAll(n => n.name === 'site-nav__link'); const act = links.find(l => l.fills.length); const actFill = JSON.parse(JSON.stringify(act.fills));
  for (const l of links) { const t = l.findOne(n => n.type === 'TEXT'); if (t.characters === 'Про нас') { l.fills = actFill; t.fills = solid('#ffffff'); } else { l.fills = []; t.fills = solid(DEEP); } }
  f.resize(1440, y);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== f).map(n => n.x + n.width));
  f.x = right + 160; f.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'about-alt'); lab.name = 'Підпис — Про нас, альтернатива';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '10  Про нас — альтернативна версія';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Альтернатива до «07 Про нас» (тільки у Фігмі)';
  ts[2].characters = 'Світла й коротша: заголовок і три фото, історія з реальними фактами, що входить в оренду (6 плиток), банер';
  lab.x = f.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(f.x + 1440 + 200, Math.max(vsec.height, 866 + y + 200));
  figma.viewport.scrollAndZoomIntoView([f]);
  return JSON.stringify({ id: f.id, h: y, full: about.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
