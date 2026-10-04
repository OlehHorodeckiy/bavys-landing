// Game page hero on the user's light background (white + grass): dark type, brown buttons, white facts plate, light header.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', CREAM = '#f9f6f3', STROKE = '#e6dfd8';
  const page = await N('1518:139'), hero = await N('1518:444');
  // background: keep the user's photo, drop the warm radial glows of the dark version
  hero.fills = hero.fills.filter(f => f.type === 'IMAGE');
  // pill
  const pill = await N('1518:445'); pill.fills = solid(CREAM);
  // title: «Велика» deep bold, «Дженга» brown light
  const t = await N('1518:448'); const sp = t.characters.indexOf(' ') + 1;
  t.setRangeFills(0, sp, solid(DEEP)); t.setRangeFills(sp, t.characters.length, solid(PRI));
  // body
  (await N('1518:449')).fills = solid(INK);
  // primary button: brown with a white disc
  const b1 = await N('1518:450'); b1.fills = solid(PRI);
  b1.findOne(n => n.type === 'TEXT').fills = solid('#ffffff');
  const disc = b1.findOne(n => n.name === 'btn__disc'); disc.fills = solid('#ffffff');
  for (const v of disc.findAll(n => n.type === 'VECTOR')) { if (v.fills.length) v.fills = solid(PRI); if (v.strokes.length) v.strokes = solid(PRI); }
  // secondary: brown outline
  const b2 = await N('1518:456'); b2.strokes = solid(PRI); b2.strokeWeight = 1; b2.strokeAlign = 'INSIDE';
  b2.findOne(n => n.type === 'TEXT').fills = solid(PRI);
  // facts plate: solid white card with a soft shadow
  const facts = await N('1518:462');
  facts.fills = solid('#ffffff');
  facts.effects = [{ type: 'DROP_SHADOW', color: { r: 0.17, g: 0.06, b: 0.01, a: 0.1 }, offset: { x: 0, y: 12 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
  facts.strokes = [];
  for (const tx of facts.findAll(n => n.type === 'TEXT')) tx.fills = solid(tx.fontSize >= 20 ? DEEP : MUTED);
  for (const v of facts.findAll(n => n.type === 'VECTOR')) { if (v.strokes.length) v.strokes = solid(ACC); if (v.fills.length) v.fills = solid(ACC); }
  for (const f of facts.findAll(n => n.type !== 'TEXT' && n.type !== 'VECTOR' && 'strokes' in n && n.strokes.length)) f.strokes = solid(STROKE);
  // header: light version with «Ігри» active (taken from the catalogue page)
  const cat = await N('1510:33541');
  const light = cat.children.find(c => c.name === 'site-header');
  const old = page.children.find(c => c.name === 'site-header');
  const nh = light.clone(); page.insertChild(page.children.indexOf(old), nh); nh.x = 0; nh.y = 0; old.remove();
  return 'ok';
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
