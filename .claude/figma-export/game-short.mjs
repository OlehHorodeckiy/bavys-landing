// Alternative, shorter game page (Figma-first study): hero → rules in a row → CTA → related → footer.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452';
  const page = await N('1518:139'), vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'game-short' || n.getPluginData('bavys-label') === 'game-short')) n.remove();
  const by = (name) => page.children.find(c => c.name === name);
  const text = (parent, chars, size, lh, style, color, x, y, w, align) => {
    const t = figma.createText(); parent.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars;
    t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); if (align) t.textAlignHorizontal = align;
    if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t;
  };
  const f = figma.createFrame(); vsec.appendChild(f); f.name = 'Сторінка гри — коротка версія'; f.setPluginData('bavys-import', 'game-short'); f.fills = solid('#ffffff'); f.clipsContent = true;
  let y = 0;
  const put = (n) => { const c = n.clone(); f.appendChild(c); c.x = 0; c.y = y; y += c.height; return c; };
  put(by('hero'));
  // rules in one row
  const R = figma.createFrame(); f.appendChild(R); R.name = 'game-rules · коротко'; R.fills = solid('#f9f6f3'); R.x = 0; R.y = y;
  const h = text(R, 'Правила за одну хвилину', 48, 56, 'Bold', DEEP, 0, 80, 1440, 'CENTER');
  h.setRangeFontName('Правила '.length, h.characters.length, { family: 'Comfortaa', style: 'Light' }); h.setRangeFills('Правила '.length, h.characters.length, solid(PRI));
  const sub = text(R, 'На місці адміністратор покаже все наживо.', 18, 28, 'Medium', INK, 0, h.y + h.height + 16, 1440, 'CENTER');
  const items = (await N('1518:164')).children.filter(c => c.name === 'rules__item');
  let bottom = 0;
  items.forEach((it, i) => {
    const ts = it.children.filter(c => c.type === 'TEXT'); const x = 80 + i * (384 + 64), top = sub.y + sub.height + 56;
    const no = text(R, String(i + 1).padStart(2, '0'), 48, 56, 'Light', ACC, x, top);
    const tt = text(R, ts[0].characters, 20, 28, 'Bold', DEEP, x, top + 56 + 16, 384);
    const tb = text(R, ts[1].characters, 16, 26, 'Medium', INK, x, tt.y + tt.height + 8, 384);
    bottom = Math.max(bottom, tb.y + tb.height);
  });
  R.resize(1440, Math.ceil((bottom + 80) / 2) * 2); y += R.height;
  put(by('cta-section'));
  put(by('game-related'));
  put(by('site-footer'));
  const hd = by('site-header').clone(); f.appendChild(hd); hd.x = 0; hd.y = 0;
  f.resize(1440, y);
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && n !== f).map(n => n.x + n.width));
  f.x = right + 160; f.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'game-short'); lab.name = 'Підпис — Сторінка гри, коротка версія';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '09  Сторінка гри — коротка версія';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Альтернатива до «03 Сторінка гри» (тільки у Фігмі)';
  ts[2].characters = 'Перший екран з фактами, правила трьома кроками в ряд, банер, інші ігри. Без «Що це за гра?» і «Усе, що варто знати»';
  lab.x = f.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(f.x + 1440 + 200, Math.max(vsec.height, 866 + y + 200));
  figma.viewport.scrollAndZoomIntoView([f]);
  return JSON.stringify({ id: f.id, x: f.x, h: y, full: page.height, rules: R.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
