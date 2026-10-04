// «Із любові до дерев’яних ігор» on the About page: three alternatives (Figma-first study).
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', CREAM = '#f9f6f3';
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'story-variants' || n.getPluginData('bavys-label') === 'story-variants')) n.remove();
  const home = vsec.parent.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === 'home')[0];
  const gal = (start) => home.findOne(n => n.type === 'RECTANGLE' && n.name.startsWith(start)).fills.find(f => f.type === 'IMAGE');
  const text = (parent, chars, size, lh, style, color, x, y, w, align) => {
    const t = figma.createText(); parent.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars;
    t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); if (align) t.textAlignHorizontal = align;
    if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t;
  };
  const accent = (t, from) => { t.setRangeFontName(from, t.characters.length, { family: 'Comfortaa', style: 'Light' }); t.setRangeFills(from, t.characters.length, solid(PRI)); };
  const pill = (parent, label, x, y, fill) => {
    const p = figma.createFrame(); parent.appendChild(p); p.name = 'pill'; p.fills = solid(fill); p.cornerRadius = 16;
    p.layoutMode = 'HORIZONTAL'; p.itemSpacing = 8; p.paddingLeft = 16; p.paddingRight = 16; p.counterAxisAlignItems = 'CENTER';
    p.resize(10, 32); p.primaryAxisSizingMode = 'AUTO'; p.counterAxisSizingMode = 'FIXED';
    const d = figma.createEllipse(); p.appendChild(d); d.resize(6, 6); d.fills = solid(DEEP);
    const t = figma.createText(); p.appendChild(t); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = label; t.fontSize = 12; t.lineHeight = { unit: 'PIXELS', value: 16 }; t.letterSpacing = { unit: 'PERCENT', value: 8 }; t.fills = solid(DEEP); t.textAutoResize = 'WIDTH_AND_HEIGHT';
    const w = Math.ceil(p.width / 2) * 2; p.primaryAxisSizingMode = 'FIXED'; p.resize(w, 32);
    p.x = x === 'c' ? (1440 - w) / 2 : x; p.y = y; return p;
  };
  const S1 = 'Бавись починався з кількох великих ігор, які ми робили для свят друзів. Гості не відходили від них до ночі, і ми зрозуміли, що це варто робити для всіх.';
  const S2 = 'Сьогодні в нашій колекції 16 дерев’яних ігор для дорослих і дітей. Ми дбаємо про кожну так, ніби вона їде на наше власне свято.';
  const FACTS = [['16', 'дерев’яних ігор у колекції'], ['800 грн', 'за гру на добу'], ['Львів', 'та область, з доставкою']];
  const W = 1440;
  const wrap = figma.createFrame(); vsec.appendChild(wrap); wrap.name = 'Про нас · історія — 3 варіанти (A, B, C)'; wrap.setPluginData('bavys-import', 'story-variants'); wrap.fills = solid('#ffffff');
  let y = 0;
  const bar = (txt) => { const f = figma.createFrame(); wrap.appendChild(f); f.name = 'lab__label'; f.resize(W, 80); f.y = y; f.fills = solid(DEEP); text(f, txt, 20, 32, 'Bold', '#ffffff', 80, 24); y += 80; };
  const sec = (name, fill) => { const s = figma.createFrame(); wrap.appendChild(s); s.name = name; s.fills = solid(fill); s.x = 0; s.y = y; s.resize(W, 100); s.clipsContent = true; return s; };

  // A · big quote
  bar('Про нас · історія · A · Велика цитата по центру й факти рядком');
  const A = sec('about-story · A', CREAM);
  pill(A, 'НАША ІСТОРІЯ', 'c', 80, '#ffffff');
  const q = text(A, '«Гості не відходили від наших ігор до ночі, і ми зрозуміли, що це варто робити для всіх»', 40, 52, 'Light', DEEP, 200, 144, 1040, 'CENTER');
  const qs = text(A, 'Команда Бавись', 16, 24, 'Bold', ACC, 0, q.y + q.height + 24, W, 'CENTER');
  const line = figma.createRectangle(); A.appendChild(line); line.resize(1280, 1); line.x = 80; line.y = qs.y + qs.height + 56; line.fills = solid('#e6dfd8');
  FACTS.forEach(([v, l], i) => { const x = 80 + i * 432;
    text(A, v, 48, 56, 'Light', ACC, x, line.y + 40, 416, 'CENTER'); text(A, l, 16, 24, 'Medium', INK, x, line.y + 104, 416, 'CENTER'); });
  A.resize(W, line.y + 104 + 24 + 80); y += A.height;

  // B · photo left, text right
  bar('Про нас · історія · B · Фото зліва, текст і факти справа');
  const B = sec('about-story · B', '#ffffff');
  const ph = figma.createRectangle(); B.appendChild(ph); ph.resize(560, 480); ph.x = 80; ph.y = 80; ph.cornerRadius = 24;
  ph.fills = [{ type: 'IMAGE', imageHash: gal('Гра «Галактика»').imageHash, scaleMode: 'FILL' }];
  pill(B, 'НАША ІСТОРІЯ', 720, 80, CREAM);
  const tb = text(B, 'Із любові\\nдо дерев’яних ігор', 48, 56, 'Bold', DEEP, 720, 132, 640); accent(tb, 'Із любові\\n'.length);
  const b1 = text(B, S1, 18, 30, 'Medium', INK, 720, tb.y + tb.height + 24, 640);
  const b2 = text(B, S2, 18, 30, 'Medium', INK, 720, b1.y + b1.height + 16, 640);
  const fy = b2.y + b2.height + 40;
  FACTS.forEach(([v, l], i) => { const c = figma.createFrame(); B.appendChild(c); c.name = 'fact'; c.fills = solid(CREAM); c.cornerRadius = 16; c.resize(200, 120); c.x = 720 + i * 220; c.y = fy;
    text(c, v, 28, 36, 'Bold', DEEP, 20, 20); text(c, l, 14, 20, 'Medium', MUTED, 20, 60, 168); });
  B.resize(W, Math.max(ph.y + ph.height, fy + 120) + 80); y += B.height;

  // C · text centred, facts as big cards
  bar('Про нас · історія · C · Текст по центру, факти великими картками');
  const C = sec('about-story · C', CREAM);
  pill(C, 'НАША ІСТОРІЯ', 'c', 80, '#ffffff');
  const tc = text(C, 'Із любові до дерев’яних ігор', 48, 56, 'Bold', DEEP, 0, 132, W, 'CENTER'); accent(tc, 'Із любові '.length);
  const c1 = text(C, S1 + ' ' + S2, 18, 30, 'Medium', INK, 280, tc.y + tc.height + 24, 880, 'CENTER');
  const cy = c1.y + c1.height + 56;
  FACTS.forEach(([v, l], i) => { const c = figma.createFrame(); C.appendChild(c); c.name = 'fact-card'; c.fills = solid('#ffffff'); c.cornerRadius = 24; c.resize(416, 200); c.x = 80 + i * 432; c.y = cy;
    text(c, v, 64, 72, 'Light', ACC, 0, 40, 416, 'CENTER'); text(c, l, 16, 24, 'Medium', INK, 0, 128, 416, 'CENTER'); });
  C.resize(W, cy + 200 + 80); y += C.height;

  wrap.resize(W, y);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== wrap).map(n => n.x + n.width));
  wrap.x = right + 160; wrap.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'story-variants'); lab.name = 'Підпис — Про нас, історія';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '11  Про нас · історія — 3 варіанти';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Секція «Із любові до дерев’яних ігор» на «07 Про нас» (тільки у Фігмі)';
  ts[2].characters = 'A · велика цитата й факти рядком, B · фото зліва, текст і факти-картки справа, C · текст по центру й три великі картки з фактами';
  lab.x = wrap.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(wrap.x + W + 200, Math.max(vsec.height, 866 + y + 200));
  figma.viewport.scrollAndZoomIntoView([wrap]);
  return JSON.stringify({ id: wrap.id, h: y, A: A.height, B: B.height, C: C.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
