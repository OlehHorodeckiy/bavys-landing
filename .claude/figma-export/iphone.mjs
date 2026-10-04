// Wrap a mobile import frame as an iPhone screen: content shifted under the iOS status bar
// (Apple's «Status bar - iPhone» instance, 390 wide), home indicator at the bottom; glass wordmark fix.
const [mark, name, bgHex = '#ffffff', fg = 'dark'] = process.argv.slice(2);
const code = `
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const f = site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === ${JSON.stringify(mark)})[0];
  if (!f) return 'missing';
  const SB = 62;
  for (const old of f.children.filter(c => c.getPluginData('iphone'))) old.remove();
  if (f.getPluginData('iphone-shifted') !== '1') {
    for (const c of f.children) c.y += SB;
    f.resize(390, f.height + SB);
    f.setPluginData('iphone-shifted', '1');
  }
  // status bar
  const comp = await figma.importComponentByKeyAsync('51ddb19de206b67eae2d554b1d20c018feb754f4');
  const sb = comp.createInstance(); f.appendChild(sb); sb.setPluginData('iphone', '1');
  sb.resize(390, SB); sb.x = 0; sb.y = 0; sb.name = 'iOS · Status bar';
  try { sb.setProperties({ 'Time#5466:4': '9:41' }); } catch (e) {}
  // white strip behind the status bar (the page is white at the top)
  const bg = figma.createRectangle(); f.insertChild(0, bg); bg.setPluginData('iphone', '1'); bg.name = 'iOS · status bar bg';
  bg.resize(390, SB); bg.x = 0; bg.y = 0;
  const h = ${JSON.stringify(bgHex)}; bg.fills = [{ type: 'SOLID', color: { r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 } }];
  if (${JSON.stringify(fg)} === 'light') for (const n of sb.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.length && n.fills[0].type === 'SOLID')) n.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  // home indicator: 134×6 pill, 8 from the bottom; light on the dark footer
  const hi = figma.createFrame(); f.appendChild(hi); hi.setPluginData('iphone', '1'); hi.name = 'iOS · Home indicator';
  hi.resize(390, 34); hi.x = 0; hi.y = f.height - 34; hi.fills = [];
  const pill = figma.createRectangle(); hi.appendChild(pill); pill.resize(134, 6); pill.cornerRadius = 3;
  pill.x = 128; pill.y = 20; pill.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  // glass wordmark in the footer (the export loses the SVG fill/stroke)
  const foot = f.findOne(n => n.name === 'site-footer');
  let glass = 0;
  if (foot) for (const v of foot.findAll(n => n.type === 'VECTOR' && n.absoluteBoundingBox && n.absoluteBoundingBox.height > 30 && n.absoluteBoundingBox.y > foot.absoluteBoundingBox.y + foot.height * 0.6)) {
    v.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.24 }];
    v.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.5 }]; v.strokeWeight = 2; v.strokeAlign = 'INSIDE'; glass++;
  }
  f.name = ${JSON.stringify(name)};
  return f.name + ' ' + f.width + 'x' + f.height + ' glass ' + glass;
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 300));
