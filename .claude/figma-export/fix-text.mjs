// Typesetting pass on the new stories: balanced manual line breaks, titles 100/112, NBSP after one-letter words, no em dashes.
const TITLES = {
  'Великий морський бій': 'Великий\nморський бій',
  'Велика китайська стіна': 'Велика\nкитайська стіна',
  'Японський більярд': 'Японський\nбільярд',
  'Кільцекид щит': 'Кільцекид щит',
};
const DESC = {
  'Кільцекид щит': 'Накидай кільця на гачки щита й збирай від 10 до 100 очок за кидок! Влучність, азарт і веселощі для всіх.',
};
const TEASER = [
  'Пам’ятаєте гру,\nв яку ми могли грати\nгодинами в дитинстві? 👀',
  'Де потрібно було\nтихенько сидіти,\nробити хід і казати:\n«А якщо ось сюди?..» 👀',
  null,
  'Ми вирішили\nповернути цю гру…\nале тепер вона стала\nвеликою і зовсім\nне дитячою 👀',
  null,
];
const code = `
  const TITLES = ${JSON.stringify(TITLES)}, DESC = ${JSON.stringify(DESC)}, TEASER = ${JSON.stringify(TEASER)};
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const nb = (s) => s.replace(/(^|[\\s(«])([уйівзаоУЙІВЗАО]) /g, '$1$2\\u00A0').replace(/ (\\d+) /g, ' $1\\u00A0');
  const page = figma.root.children.find(p => p.name === 'UI');
  const games = page.children.find(n => n.getPluginData('bavys-stories'));
  const teaser = page.children.find(n => n.getPluginData('bavys-teaser'));
  const out = [];
  // the top shade the user stretched on «Японський більярд» goes to all four
  const jp = games.children.find(f => f.name.endsWith('Японський більярд'));
  const jpShade = jp.children.find(c => c.name === 'Rectangle 1430106908');
  for (const f of games.children) {
    const key = Object.keys(TITLES).find(k => f.name.endsWith('— ' + k));
    if (!key) continue;
    const t = f.findOne(n => n.type === 'TEXT' && n.fontSize >= 100 && n.fontSize <= 120);
    t.characters = TITLES[key]; t.fontSize = 100; t.lineHeight = { unit: 'PIXELS', value: 112 };
    const d = f.findOne(n => n.type === 'TEXT' && n.fontSize === 40);
    d.characters = nb((DESC[key] || d.characters).replace(/ — /g, ', '));
    d.lineHeight = { unit: 'PIXELS', value: 64 };
    const shade = f.children.find(c => c.name === 'Rectangle 1430106908');
    if (shade !== jpShade) { shade.fills = jpShade.fills; shade.resizeWithoutConstraints(jpShade.width, jpShade.height); shade.x = jpShade.x; shade.y = jpShade.y; }
    const box = t.parent.parent.parent;
    out.push(key + ': title ' + t.height + ', desc ' + d.height + ' (' + d.height / 64 + ' lines), text ends at ' + (box.y + box.height));
  }
  teaser.children.forEach((f, i) => {
    const box = f.findOne(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL');
    const t = box.findOne(n => n.type === 'TEXT' && n.fontSize === 64);
    if (TEASER[i]) t.characters = TEASER[i];
    box.y = Math.round((1920 - box.height) / 4) * 2;
    out.push(f.name + ': ' + t.height / 96 + ' lines, box ' + box.y + '–' + (box.y + box.height));
  });
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
