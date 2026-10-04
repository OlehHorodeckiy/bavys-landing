// Game page: merge «Що це за гра?» and «Правила за одну хвилину» into one section (left: about, right: rules card).
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
  const page = await N('1518:139'), about = await N('1518:140'), rulesSec = await N('1518:158');
  const lead = await N('1518:142'), p1 = await N('1518:143'), p2 = await N('1518:144');
  // left column: lead + both paragraphs, chips go (the facts line in the hero already says it)
  for (const id of ['1518:145', '1518:153']) { const n = await N(id); if (n) n.remove(); }
  p1.x = 80; p1.resize(560, p1.height); p1.y = lead.y + lead.height + 32;
  p2.x = 80; p2.resize(560, p2.height); p2.y = p1.y + p1.height + 16;
  const leftBottom = p2.y + p2.height;
  // right column: the rules list becomes a white card with its own heading
  const rules = await N('1518:164');
  about.appendChild(rules); rules.x = 744; rules.y = 80;
  rules.fills = solid('#ffffff'); rules.cornerRadius = 24;
  const items = rules.children.filter(c => c.name === 'rules__item');
  const h = figma.createText(); rules.appendChild(h);
  h.fontName = { family: 'Comfortaa', style: 'Bold' }; h.characters = 'Правила за одну хвилину'; h.fontSize = 24; h.lineHeight = { unit: 'PIXELS', value: 32 };
  h.setRangeFontName('Правила '.length, h.characters.length, { family: 'Comfortaa', style: 'Light' });
  h.fills = solid('#2b1003'); h.setRangeFills('Правила '.length, h.characters.length, solid('#866452'));
  h.x = 40; h.y = 40;
  const note = figma.createText(); rules.appendChild(note);
  note.fontName = { family: 'Comfortaa', style: 'Medium' }; note.characters = 'На місці адміністратор покаже все наживо.'; note.fontSize = 14; note.lineHeight = { unit: 'PIXELS', value: 20 };
  note.fills = solid('#9a8a80'); note.x = 40; note.y = 80;
  let y = 116;
  for (const it of items) { it.y = y; y += it.height; }
  rules.resize(rules.width, Math.ceil((y + 32) / 2) * 2);
  // section height, drop the old rules section, close the gap
  const oldAboutH = about.height;
  about.resize(1440, Math.ceil((Math.max(leftBottom, rules.y + rules.height) + 80) / 2) * 2);
  const rulesH = rulesSec.height, rulesY = rulesSec.y; rulesSec.remove();
  const d = (about.height - oldAboutH) - rulesH;
  for (const c of page.children) if (c !== about && c.y > about.y) c.y += d;
  page.resize(1440, page.height + d);
  return JSON.stringify({ about: about.height, rules: [rules.width, rules.height], page: page.height, d });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
