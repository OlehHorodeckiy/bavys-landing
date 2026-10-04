// Variant B reworked: button under the text, three tall game ovals filling the height; then copied into the home frame.
const code = `
  const N = (id) => figma.getNodeByIdAsync(id);
  const b = await N('1539:3812');
  const text = await N('1539:3818'), btn = await N('1539:3819');
  const ovals = [await N('1539:3825'), await N('1539:3826'), await N('1539:3827')];
  const PAD = 64, W = 1280;
  btn.x = PAD; btn.y = text.y + text.height + 32;
  const H = btn.y + btn.height + PAD;
  b.resize(W, H);
  const OW = 152, GAP = 20, OPAD = 32, OH = H - OPAD * 2;
  ovals.forEach((o, i) => {
    o.resize(OW, OH); o.cornerRadius = OW / 2; o.strokes = [];
    o.x = W - PAD - (3 - i) * OW - (2 - i) * GAP; o.y = OPAD;
  });
  // the variant's section and the variants wrapper below it
  const secB = b.parent, wrap = secB.parent;
  const dB = 80 + H + 80 - secB.height; secB.resize(secB.width, 80 + H + 80);
  for (const c of wrap.children) if (c.y > secB.y) c.y += dB;
  wrap.resize(wrap.width, wrap.height + dB);
  // into the home frame, replacing the current banner
  const home = await N('1510:32939'), sec = await N('1510:33307');
  const old = sec.children.find(c => c.name === 'cta-banner');
  const nb = b.clone(); sec.insertChild(sec.children.indexOf(old), nb); nb.x = old.x; nb.y = old.y; old.remove();
  const dH = 80 + H + 80 - sec.height; sec.resize(sec.width, 80 + H + 80);
  for (const c of home.children) if (c.y > sec.y) c.y += dH;
  home.resize(home.width, home.height + dH);
  return JSON.stringify({ H, ovals: ovals.map(o => [o.x, o.y, o.width, o.height]), btn: [btn.x, btn.y], homeH: home.height, sec: sec.height, newBanner: nb.id });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
