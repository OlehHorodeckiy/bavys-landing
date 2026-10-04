// Mobile home hero after the user's sketch (1554:24465): text on top, the Jenga tower big and centred
// on the lawn below, the arch strip over the grass at the bottom. Tidied to the site grid (20px sides, even values).
const code = `
  for (const s of ['Light', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const sk = await N('1554:24465');
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const home = site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === 'm-home')[0];
  const old = home.children.find(c => c.name === 'hero');
  const SB = 62, H = sk.height - SB;            // the sketch includes the status bar
  const hero = figma.createFrame(); home.insertChild(home.children.indexOf(old), hero);
  hero.name = 'hero'; hero.resize(390, H); hero.x = 0; hero.y = old.y; hero.clipsContent = true; hero.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  // background: the sketch's photo crop minus the status-bar band
  const src = sk.children.find(c => c.type === 'RECTANGLE');
  const bg = src.clone(); hero.appendChild(bg); bg.name = 'фото · вежа Дженги на газоні'; bg.x = 0; bg.y = 0; bg.resize(390, H);
  const f = JSON.parse(JSON.stringify(src.fills.find(x => x.type === 'IMAGE')));
  if (f.scaleMode === 'CROP' && f.imageTransform) {
    const [[a, b, c], [d, e, g]] = f.imageTransform; const k = H / sk.height;
    f.imageTransform = [[a, b, c], [d, e * k, g + e * (SB / sk.height)]];
  } else {
    // FILL: centre-crop the same way the sketch shows it
    const sz = await figma.getImageByHash(f.imageHash).getSizeAsync(); const s = H / sz.height; const iw = sz.width * s;
    const sx = 390 / iw; f.scaleMode = 'CROP'; f.imageTransform = [[sx, 0, (1 - sx) / 2], [0, 1, 0]];
  }
  bg.fills = [f];
  // text on the 20px grid
  const t = sk.children.find(c => c.type === 'TEXT' && c.fontSize === 32).clone(); hero.appendChild(t);
  t.x = 20; t.y = 100; t.lineHeight = { unit: 'PIXELS', value: 40 }; t.textAutoResize = 'HEIGHT'; t.resize(350, t.height);
  const p = sk.children.find(c => c.type === 'TEXT' && c.fontSize === 18).clone(); hero.appendChild(p);
  p.x = 20; p.y = t.y + t.height + 16; p.textAutoResize = 'HEIGHT'; p.resize(350, p.height);
  const btn = sk.children.find(c => c.name === 'btn').clone(); hero.appendChild(btn);
  btn.x = 20; btn.y = p.y + p.height + 24;
  const strip = sk.children.find(c => c.name === 'hero-strip').clone(); hero.appendChild(strip);
  strip.x = 0; strip.y = H - 40 - strip.height;
  // swap and push the page down
  const dy = H - old.height, oy = old.y; old.remove();
  for (const c of home.children) if (c !== hero && c.y > oy && !c.getPluginData('iphone') && c.name !== 'site-header') c.y += dy;
  home.resize(390, home.height + dy);
  const hi = home.children.find(c => c.name === 'iOS · Home indicator'); if (hi) hi.y = home.height - 34;
  const hdr = home.children.find(c => c.name === 'site-header'); if (hdr) home.appendChild(hdr);
  for (const c of home.children.filter(c => c.getPluginData('iphone'))) home.appendChild(c);
  const tmp = figma.createFrame(); tmp.resize(390, H + SB); tmp.clipsContent = true; const k = home.clone(); tmp.appendChild(k); k.x = 0; k.y = 0;
  const img = figma.base64Encode(await tmp.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 } })); tmp.remove();
  return { t: JSON.stringify({ H, title: [t.y, t.height], btnEnd: btn.y + btn.height, strip: strip.y, dy, page: home.height, mode: src.fills[0].scaleMode }), img };
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
if (!j.value) { console.log(JSON.stringify(j).slice(0, 300)); process.exit(1); }
(await import('fs')).writeFileSync(process.argv[2], Buffer.from(j.value.img, 'base64')); console.log(j.value.t);
