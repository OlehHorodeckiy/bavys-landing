// Game page: one spacing rhythm for «Що це за гра» (+ rules card) and «Деталі гри» (tiles).
const code = `
  const N = (id) => figma.getNodeByIdAsync(id);
  const page = await N('1518:139'), about = await N('1518:140'), det = await N('1518:222');
  const out = {};
  // rules card: padding 40, heading → 8 → note → 32 → steps, 32 between steps
  const rules = await N('1518:164');
  const head = rules.children.find(c => c.type === 'TEXT' && c.fontSize === 24), note = rules.children.find(c => c.type === 'TEXT' && c.fontSize === 14);
  head.y = 40; note.y = head.y + head.height + 8;
  let y = note.y + note.height + 32;
  for (const it of rules.children.filter(c => c.name === 'rules__item')) {
    const no = it.children.find(c => c.name === 'rules__no'), ts = it.children.filter(c => c.type === 'TEXT');
    no.y = 0; ts[0].y = 2; ts[1].y = ts[0].y + ts[0].height + 6;
    it.resize(it.width, Math.ceil((ts[1].y + ts[1].height) / 2) * 2); it.y = y; y += it.height + 32;
  }
  rules.resize(rules.width, y - 32 + 40);
  // about: title → 24 → lead → 32 → p1 → 16 → p2; section padding 80
  const kids = about.children.filter(c => c.type === 'TEXT');
  const [title, lead, p1, p2] = kids;
  title.y = 80; lead.y = title.y + title.height + 24; p1.y = lead.y + lead.height + 32; p2.y = p1.y + p1.height + 16;
  const aboutOld = about.height; about.resize(1440, Math.max(p2.y + p2.height, rules.y + rules.height) + 80);
  // details: pill → 20 → title → 48 → tiles; tile: icon → 24 → label → 4 → value, padding 24
  const pill = det.children.find(c => c.name === 'pill'), dt = det.children.find(c => c.type === 'TEXT'), grid = det.children.find(c => c.name === 'specs-tiles');
  pill.y = 80; dt.y = pill.y + pill.height + 20; grid.y = dt.y + dt.height + 48;
  for (const t of grid.children) {
    t.primaryAxisSizingMode = 'AUTO'; t.itemSpacing = 4;
    const gap = t.children.find(c => c.name === 'gap'); gap.resize(gap.width, 16);
  }
  const tiles = grid.children;
  for (let r = 0; r < 2; r++) {
    const row = tiles.slice(r * 4, r * 4 + 4); const h = Math.ceil(Math.max(...row.map(t => t.height)) / 2) * 2;
    row.forEach((t, i) => { t.primaryAxisSizingMode = 'FIXED'; t.resize(308, h); t.x = i * 324; t.y = r ? tiles[0].height + 16 : 0; });
  }
  grid.resize(1280, tiles[4].y + tiles[4].height);
  const detOld = det.height; det.resize(1440, grid.y + grid.height + 80);
  // stack sections
  const dA = about.height - aboutOld; det.y += dA;
  const dAll = dA + det.height - detOld;
  for (const c of page.children) if (c !== about && c !== det && c.y > about.y) c.y += dAll;
  page.resize(1440, page.height + dAll);
  return JSON.stringify({ rules: rules.height, about: about.height, det: det.height, tiles: [tiles[0].height, tiles[4].height], page: page.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
