// Three first-screen variants for the catalogue page (Figma-first study), in «Варіанти на вибір».
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', CREAM = '#f9f6f3', STROKE = '#e6dfd8';
  const shadow = [{ type: 'DROP_SHADOW', color: { r: 0.17, g: 0.06, b: 0.01, a: 0.08 }, offset: { x: 0, y: 12 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'catalog-hero' || n.getPluginData('bavys-label') === 'catalog-hero')) n.remove();
  const photos = await Promise.all(['1510:33567', '1510:33584', '1510:33601', '1510:33618'].map(async id => (await N(id)).fills));
  const homeHeader = await N('1510:33516'), btnSrc = await N('1510:32957');

  const text = (parent, chars, size, lh, style, color, x, y, w, align) => {
    const t = figma.createText(); parent.appendChild(t);
    t.fontName = { family: 'Comfortaa', style }; t.characters = chars; t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh };
    t.fills = solid(color); if (align) t.textAlignHorizontal = align;
    if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = x; t.y = y; return t;
  };
  const box = (parent, name, w, h, x, y, fill, r) => {
    const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.resize(w, h); f.x = x; f.y = y;
    f.fills = fill ? solid(fill) : []; f.cornerRadius = r || 0; f.clipsContent = false; return f;
  };
  const title = (parent, x, y, w, align, oneLine) => {
    const a = oneLine ? 'Наші ' : 'Наші\\n';
    const t = text(parent, a + 'дерев’яні ігри', 60, 64, 'Bold', DEEP, x, y, w, align);
    t.setRangeFontName(a.length, t.characters.length, { family: 'Comfortaa', style: 'Light' });
    t.setRangeFills(a.length, t.characters.length, solid(PRI));
    t.letterSpacing = { unit: 'PERCENT', value: -2 };
    return t;
  };
  const pill = (parent, label, x, y, fill) => {
    const p = box(parent, 'pill', 10, 32, x, y, fill, 16);
    p.layoutMode = 'HORIZONTAL'; p.itemSpacing = 8; p.paddingLeft = 16; p.paddingRight = 16; p.counterAxisAlignItems = 'CENTER';
    p.primaryAxisSizingMode = 'AUTO'; p.counterAxisSizingMode = 'FIXED';
    const d = figma.createEllipse(); p.appendChild(d); d.resize(6, 6); d.fills = solid(DEEP);
    const t = figma.createText(); p.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = label; t.fontSize = 12; t.lineHeight = { unit: 'PIXELS', value: 16 }; t.letterSpacing = { unit: 'PERCENT', value: 8 }; t.fills = solid(DEEP);
    return p;
  };
  const button = (parent, label, x, y) => {
    const b = btnSrc.clone(); parent.appendChild(b);
    const t = b.findOne(n => n.type === 'TEXT'); t.characters = label; t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = 0;
    const lab = b.findOne(n => n.name === 'btn__label'), disc = b.findOne(n => n.name === 'btn__disc');
    const tw = Math.ceil(t.width / 2) * 2; lab.resize(tw, lab.height); disc.x = 23 + tw + 9;
    b.resize(Math.ceil((disc.x + disc.width + 7) / 2) * 2, b.height); b.x = x; b.y = y; return b;
  };
  const header = (parent) => {
    const h = homeHeader.clone(); parent.appendChild(h); h.x = 0; h.y = 0;
    const links = h.findAll(n => n.name === 'site-nav__link');
    links.forEach((l, i) => { const t = l.findOne(n => n.type === 'TEXT');
      if (i === 1) { l.fills = solid(ACC); t.fills = solid('#ffffff'); } else { l.fills = []; t.fills = solid(DEEP); } });
    return h;
  };
  const chip = (parent, label, active) => {
    const c = box(parent, 'chip · ' + label, 10, 44, 0, 0, active ? PRI : '#ffffff', 22);
    c.layoutMode = 'HORIZONTAL'; c.paddingLeft = 20; c.paddingRight = 20; c.counterAxisAlignItems = 'CENTER';
    c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
    if (!active) { c.strokes = solid(STROKE); c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; }
    const t = figma.createText(); c.appendChild(t); t.fontName = { family: 'Comfortaa', style: active ? 'Bold' : 'Medium' }; t.characters = label;
    t.fontSize = 14; t.lineHeight = { unit: 'PIXELS', value: 20 }; t.fills = solid(active ? '#ffffff' : DEEP);
    return c;
  };
  const W = 1440;
  const BODY = 'Уся колекція в одному місці. Оберіть формат події, і ми покажемо ігри, які на ньому працюють найкраще.';

  const wrap = figma.createFrame(); vsec.appendChild(wrap);
  wrap.name = 'Каталог · перший екран — 3 варіанти (A, B, C)'; wrap.setPluginData('bavys-import', 'catalog-hero'); wrap.fills = solid('#ffffff');
  let y = 0;
  const bar = (txt) => { const f = box(wrap, 'lab__label', W, 80, 0, y, DEEP); text(f, txt, 20, 32, 'Bold', '#ffffff', 80, 24); y += 80; };
  const section = (name, h, fill) => { const s = box(wrap, name, W, h, 0, y, fill); s.clipsContent = true; y += h; return s; };

  // A · text left with real numbers, 2×2 game photos right
  bar('Каталог · A · Текст зліва, цифри, сітка фото ігор справа');
  const A = section('hero · A', 696, '#ffffff');
  header(A);
  pill(A, 'КАТАЛОГ', 80, 160, CREAM);
  const tA = title(A, 80, 212, 560, 'LEFT');
  const bA = text(A, BODY, 20, 34, 'Medium', INK, 80, tA.y + tA.height + 24, 520);
  const stats = [['11', 'ігор у колекції'], ['800 грн', 'за гру на добу'], ['Львів', 'та область, з доставкою']];
  let sx = 80; const sy = bA.y + bA.height + 32;
  for (const [v, l] of stats) { const g = box(A, 'stat · ' + v, 10, 10, sx, sy);
    const tv = text(g, v, 28, 32, 'Bold', DEEP, 0, 0); const tl = text(g, l, 14, 20, 'Medium', INK, 0, 36, 150);
    g.resize(Math.max(tv.width, 150), 56); sx += g.width + 32; }
  button(A, 'Допоможіть обрати', 80, sy + 56 + 40);
  photos.forEach((f, i) => { const r = figma.createRectangle(); A.appendChild(r); r.name = 'фото гри ' + (i + 1);
    r.resize(312, 216); r.x = 720 + (i % 2) * 328; r.y = 160 + Math.floor(i / 2) * 232; r.cornerRadius = 24; r.fills = f; });

  // B · compact centred on cream with event chips as the filter
  bar('Каталог · B · Компактний по центру, одразу фільтр за подією');
  const B = section('hero · B', 538, CREAM);
  header(B);
  const pB = pill(B, 'КАТАЛОГ', 0, 160, '#ffffff'); pB.x = Math.round((W - pB.width) / 4) * 2;
  const tB = title(B, 200, 212, 1040, 'CENTER', true);
  text(B, BODY, 20, 34, 'Medium', INK, 400, tB.y + tB.height + 24, 640, 'CENTER');
  const row = box(B, 'chips', 10, 44, 0, 414); row.layoutMode = 'HORIZONTAL'; row.itemSpacing = 12; row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'FIXED';
  for (const [l, a] of [['Усі ігри · 11', true], ['Весілля'], ['Корпоративи'], ['Дні народження'], ['Фестивалі'], ['Тімбілдинг'], ['Сімейні свята']]) row.appendChild(chip(row, l, a));
  row.x = Math.round((W - row.width) / 4) * 2;

  // C · game picker: event, guests, where you play
  bar('Каталог · C · Підбір гри: подія, кількість гостей, де граєте');
  const C = section('hero · C', 584, '#ffffff');
  header(C);
  const pC = pill(C, 'КАТАЛОГ', 0, 160, CREAM); pC.x = Math.round((W - pC.width) / 4) * 2;
  const tC = text(C, 'Підберемо гру\\nпід ваше свято', 60, 64, 'Bold', DEEP, 200, 212, 1040, 'CENTER');
  tC.setRangeFontName('Підберемо гру\\n'.length, tC.characters.length, { family: 'Comfortaa', style: 'Light' });
  tC.setRangeFills('Підберемо гру\\n'.length, tC.characters.length, solid(PRI));
  const bar2 = box(C, 'picker', 976, 88, 232, tC.y + tC.height + 40, '#ffffff', 44); bar2.effects = shadow;
  bar2.strokes = solid(STROKE); bar2.strokeWeight = 1; bar2.strokeAlign = 'INSIDE';
  const fields = [['Подія', 'Весілля'], ['Гостей', '20–60'], ['Де граєте', 'Надворі']];
  fields.forEach(([lab, val], i) => {
    const fx = 40 + i * 248;
    text(bar2, lab, 12, 16, 'Bold', MUTED, fx, 20);
    text(bar2, val + '  ▾', 18, 24, 'Bold', DEEP, fx, 40);
    if (i) { const d = figma.createRectangle(); bar2.appendChild(d); d.resize(1, 40); d.x = fx - 24; d.y = 24; d.fills = solid(STROKE); }
  });
  const go = box(bar2, 'btn · Показати ігри', 216, 64, 976 - 12 - 216, 12, PRI, 32);
  const gt = text(go, 'Показати ігри', 16, 24, 'Bold', '#ffffff', 0, 20); gt.x = Math.round((216 - gt.width) / 4) * 2;
  text(C, 'або перегляньте всі 11 ігор нижче', 14, 20, 'Medium', MUTED, 0, bar2.y + 88 + 24, 1440, 'CENTER');

  wrap.resize(W, y);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== wrap).map(n => n.x + n.width));
  wrap.x = right + 160; wrap.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'catalog-hero'); lab.name = 'Підпис — Каталог, перший екран';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '06  Каталог · перший екран — 3 варіанти';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Сторінка «02 Каталог ігор», блок hero (тільки у Фігмі)';
  ts[2].characters = 'A · текст і цифри зліва, фото ігор справа, B · компактний з фільтром подій, C · підбір гри за подією, гостями й місцем';
  lab.x = wrap.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(wrap.x + W + 200, Math.max(vsec.height, 866 + y + 200));
  figma.viewport.scrollAndZoomIntoView([wrap]);
  return JSON.stringify({ id: wrap.id, x: wrap.x, h: y });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
