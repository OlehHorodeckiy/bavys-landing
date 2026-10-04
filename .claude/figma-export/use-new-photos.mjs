// Put the user's new product photos (white + lawn) everywhere a game photo is shown in the site frames.
const MAP = { // selection node → game
  '1548:12188': '4 в ряд', '1548:12194': 'Корнхол', '1548:12196': 'Галактика', '1548:12199': 'Баланс',
  '1548:12201': 'Кільцекид', '1548:12204': 'Велика Дженга', '1548:12206': 'Рибалка', '1548:12207': 'В одні ворота',
  '1548:12208': 'Мишоловка', '1548:12209': 'Шалені камені', '1548:12211': 'На гачок', '1548:12213': 'Великий морський бій',
  '1548:12214': 'Велика китайська стіна', '1548:12215': 'Кульбутто', '1549:12216': 'Кільцекид щит', '1550:12223': 'Бірпонг',
};
const STRIP = ['Мишоловка', 'Рибалка', 'Баланс', '4 в ряд', 'Корнхол', 'Велика Дженга', 'Кільцекид', 'Галактика', 'В одні ворота', 'Шалені камені', 'На гачок'];
const code = `
  const MAP = ${JSON.stringify(MAP)}, STRIP = ${JSON.stringify(STRIP)};
  const N = (id) => figma.getNodeByIdAsync(id);
  const NEW = {};
  for (const [id, name] of Object.entries(MAP)) NEW[name] = (await N(id)).fills.find(f => f.type === 'IMAGE').imageHash;
  const fill = (h) => [{ type: 'IMAGE', imageHash: h, scaleMode: 'FILL' }];
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const frames = site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') && (n.getPluginData('bavys-import') === 'home' || n.getPluginData('bavys-import').startsWith('page-')));
  // 1) catalogue cards by title; remember old hash → game
  const oldToGame = {}; let cnt = { cards: 0, byHash: 0, strip: 0, named: 0 };
  for (const fr of frames) for (const card of fr.findAll(n => n.name === 'game-card')) {
    const t = card.findOne(n => n.type === 'TEXT' && n.fontSize === 24); if (!t) continue;
    const name = t.characters.replace(/[\\n\\u2028]/g, ' ').trim(); const r = card.findOne(n => n.type === 'RECTANGLE' && n.fills.some(f => f.type === 'IMAGE'));
    if (!r || !NEW[name]) continue;
    const old = r.fills.find(f => f.type === 'IMAGE').imageHash; if (!oldToGame[old]) oldToGame[old] = name;
    r.fills = fill(NEW[name]); r.name = 'Image · ' + name; cnt.cards++;
  }
  // 2) everything else that still shows an old card photo, or is named after a game
  for (const fr of frames) for (const r of fr.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE'))) {
    const h = r.fills.find(f => f.type === 'IMAGE').imageHash;
    if (oldToGame[h]) { r.fills = fill(NEW[oldToGame[h]]); cnt.byHash++; continue; }
    if (NEW[r.name] && r.width < 1000) { r.fills = fill(NEW[r.name]); cnt.named++; }
  }
  // 3) home hero arches: order of data/inventory.js, list rendered twice
  const home = frames.find(f => f.getPluginData('bavys-import') === 'home');
  const arches = home.children.find(c => c.name === 'hero').findAll(n => n.type === 'RECTANGLE' && n.width === 184 && n.fills.some(f => f.type === 'IMAGE'));
  arches.forEach((r, i) => { r.fills = fill(NEW[STRIP[i % STRIP.length]]); r.name = STRIP[i % STRIP.length]; cnt.strip++; });
  return JSON.stringify(cnt);
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
console.log(j.value ?? JSON.stringify(j));
