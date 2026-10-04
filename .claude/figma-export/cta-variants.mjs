// Three home CTA variants side by side in «Варіанти на вибір» (Figma-first study).
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => ['cta-variants'].includes(n.getPluginData('bavys-import')) || n.getPluginData('bavys-label') === 'cta-variants')) n.remove();
  const A0 = await N('1510:33307');
  const darkFills = (await N('1510:33096')).fills;
  const photos = [await N('1510:32977'), await N('1510:32971'), await N('1510:32965')].map(r => r.fills);

  const wrap = figma.createFrame();
  wrap.name = 'Банер бронювання — 3 варіанти (A, B, C)';
  wrap.setPluginData('bavys-import', 'cta-variants');
  wrap.fills = solid('#ffffff');
  vsec.appendChild(wrap);
  let y = 0;
  const bar = (txt) => {
    const f = figma.createFrame(); f.name = 'lab__label'; f.fills = solid('#2b1003');
    wrap.appendChild(f); f.resize(1440, 80); f.x = 0; f.y = y;
    const t = figma.createText(); t.fontName = { family: 'Comfortaa', style: 'Bold' }; t.characters = txt;
    t.fontSize = 20; t.lineHeight = { unit: 'PIXELS', value: 32 }; t.fills = solid('#ffffff');
    f.appendChild(t); t.x = 80; t.y = 24; y += 80;
  };
  const place = (n) => { wrap.appendChild(n); n.x = 0; n.y = y; y += n.height; return n; };
  const kids = (sec) => { const b = sec.children[0]; const by = (name) => b.children.find(c => c.name === name);
    return { b, bg: by('cta-banner__bg'), shade: by('cta-banner__shade'), btn: by('btn'),
      title: b.children.find(c => c.type === 'TEXT' && c.fontSize === 48), text: b.children.find(c => c.type === 'TEXT' && c.fontSize === 16) }; };

  // A · current photo banner
  bar('Банер бронювання · A · Фото й затемнення (поточний)');
  place(A0.clone()).name = 'cta-section · A';

  // B · light card with three game ovals
  bar('Банер бронювання · B · Світла картка з овалами ігор');
  const B = place(A0.clone()); B.name = 'cta-section · B';
  const kb = kids(B);
  kb.b.fills = solid('#f9f6f3');
  kb.bg.remove(); kb.shade.remove();
  const cut = 'Плануєте свято?\\n'.length;
  kb.title.setRangeFills(0, cut, solid('#2b1003'));
  kb.title.setRangeFills(cut, kb.title.characters.length, solid('#866452'));
  kb.text.fills = solid('#6b584e');
  kb.btn.fills = solid('#866452');
  const disc = kb.btn.findOne(n => n.name === 'btn__disc'); disc.fills = solid('#ffffff');
  for (const v of disc.findAll(n => n.type === 'VECTOR')) { if (v.fills.length) v.fills = solid('#866452'); if (v.strokes.length) v.strokes = solid('#866452'); }
  kb.btn.findOne(n => n.type === 'TEXT').fills = solid('#ffffff');
  photos.forEach((fills, i) => {
    const o = figma.createRectangle(); o.name = 'oval · гра ' + (i + 1);
    o.resize(112, 160); o.cornerRadius = 56; o.fills = fills;
    o.strokes = solid('#f9f6f3'); o.strokeWeight = 4; o.strokeAlign = 'OUTSIDE';
    kb.b.insertChild(kb.b.children.indexOf(kb.btn), o);
    o.x = 680 + i * 88; o.y = Math.round((kb.b.height - 160) / 4) * 2;
  });

  // C · thin dark strip, full width
  bar('Банер бронювання · C · Тонка темна смуга на всю ширину');
  const C = figma.createFrame(); C.name = 'cta-section · C'; C.fills = darkFills; C.clipsContent = true;
  C.resize(1440, 176); place(C);
  const ka = kids(A0);
  const t = ka.title.clone(); C.appendChild(t);
  t.characters = 'Плануєте свято? ігри беремо на себе';
  const cut2 = 'Плануєте свято? '.length;
  t.setRangeFontName(0, cut2, { family: 'Comfortaa', style: 'Bold' }); t.setRangeFills(0, cut2, solid('#ffffff'));
  t.setRangeFontName(cut2, t.characters.length, { family: 'Comfortaa', style: 'Light' }); t.setRangeFills(cut2, t.characters.length, solid('#efc6a8'));
  t.fontSize = 32; t.lineHeight = { unit: 'PIXELS', value: 40 }; t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.x = 80; t.y = 50;
  const tx = ka.text.clone(); C.appendChild(tx); tx.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.78 }];
  tx.textAutoResize = 'WIDTH_AND_HEIGHT'; tx.x = 80; tx.y = 50 + 40 + 8;
  const b = ka.btn.clone(); C.appendChild(b); b.x = 1440 - 80 - b.width; b.y = Math.round((176 - b.height) / 4) * 2;

  wrap.resize(1440, y);
  wrap.x = 200 + 4 * (1440 + 160); wrap.y = 866;
  // caption like the others
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'cta-variants'); lab.name = 'Підпис — Банер бронювання — 3 варіанти';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '04  Банер бронювання — 3 варіанти';
  ts[0].setRangeFills(0, ts[0].characters.length, solid('#2b1003')); ts[0].setRangeFills(0, 2, solid('#c78460'));
  ts[1].characters = 'Головна, блок перед футером (тільки у Фігмі)';
  ts[2].characters = 'A · фото й затемнення (поточний), B · світла картка з овалами ігор, C · тонка темна смуга на всю ширину';
  lab.x = wrap.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(200 * 2 + 1440 * 5 + 160 * 4, vsec.height);
  figma.viewport.scrollAndZoomIntoView([wrap]);
  return JSON.stringify({ wrap: [wrap.x, wrap.y, wrap.width, wrap.height], C: [t.width, tx.width] });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
