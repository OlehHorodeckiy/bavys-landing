// 1) put the game stories back (titles 120 one string, template top shade); 2) teaser stories on the user's frame «1» layout:
// text top-left at x60 / y150, Bold, left aligned; poll story heading Bold 100 like «Ви вже здогадались 😄».
const TITLES = ['Великий морський бій', 'Велика китайська стіна', 'Японський більярд', 'Кільцекид щит'];
const code = `
  const TITLES = ${JSON.stringify(TITLES)};
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const page = figma.root.children.find(p => p.name === 'UI');
  const games = page.children.find(n => n.getPluginData('bavys-stories'));
  const teaser = page.children.find(n => n.getPluginData('bavys-teaser'));
  const tpl = await figma.getNodeByIdAsync('1518:109');
  const tplShade = tpl.children.find(c => c.name === 'Rectangle 1430106908');
  const out = [];
  for (const f of games.children) {
    const key = TITLES.find(k => f.name.endsWith('— ' + k));
    if (!key) continue;
    const t = f.findOne(n => n.type === 'TEXT' && n.fontSize >= 100 && n.fontSize <= 120);
    t.characters = key; t.fontSize = 120; t.lineHeight = { unit: 'AUTO' };
    if (key !== 'Японський більярд') {
      const shade = f.children.find(c => c.name === 'Rectangle 1430106908');
      shade.fills = tplShade.fills; shade.resizeWithoutConstraints(tplShade.width, tplShade.height); shade.x = tplShade.x; shade.y = tplShade.y;
    }
    out.push('games: ' + key + ' back to 120');
  }
  teaser.children.forEach((f, i) => {
    const box = f.findOne(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL');
    const t = box.findOne(n => n.type === 'TEXT' && (n.fontSize === 64 || n.fontSize === 100));
    t.textAlignHorizontal = 'LEFT';
    t.letterSpacing = { unit: 'PERCENT', value: -1.953125 };
    if (i === 4) { t.fontSize = 100; t.lineHeight = { unit: 'AUTO' }; }
    box.counterAxisAlignItems = 'MIN';
    box.itemSpacing = 40;
    box.x = 60; box.y = 150;
    out.push(f.name + ': text ' + t.fontSize + ', ends at ' + (box.y + box.height));
  });
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
