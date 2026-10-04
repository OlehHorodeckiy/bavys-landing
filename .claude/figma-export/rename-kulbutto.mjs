// «Японський більярд» → «Кульбутто» in the game story, the teaser section and the facts series.
const code = `
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const page = figma.root.children.find(p => p.name === 'UI');
  const nb = (s) => s.replace(/(^|[\\s(«])([уйівзаоУЙІВЗАО]) /g, '$1$2\\u00A0');
  const out = [];
  // game story
  const games = page.children.find(n => n.getPluginData('bavys-stories'));
  const g = games.children.find(f => f.name.includes('Японський більярд'));
  if (g) {
    g.name = 'Instagram story — Кульбутто';
    const t = g.findOne(n => n.type === 'TEXT' && n.fontSize === 120); t.characters = 'Кульбутто';
    const ph = g.findOne(n => n.name.startsWith('Фото — ')); if (ph) ph.name = 'Фото — Кульбутто (1080×1920)';
    out.push('story: ' + g.name);
  }
  // teaser
  const jb = page.children.find(n => n.getPluginData('bavys-teaser-jb'));
  jb.name = 'Сторіз — тизер «Кульбутто» (4 сторіз, встав фони)';
  for (const f of jb.children) { f.name = f.name.replace('Японський більярд', 'Кульбутто'); out.push('teaser: ' + f.name); }
  // facts
  const facts = page.children.find(n => n.getPluginData('bavys-facts-new'));
  const f4 = facts.children.find(f => f.name.includes('Японський більярд'));
  f4.name = 'Факти 4 · Кульбутто';
  const title = f4.findOne(n => n.type === 'TEXT' && n.fontSize === 70);
  title.characters = 'Що таке\\nКульбутто? 🎱'; title.setRangeLineHeight(0, title.characters.length, { unit: 'PIXELS', value: 106 });
  const d = f4.findOne(n => n.type === 'TEXT' && n.fontSize === 40);
  d.characters = nb('Кульбутто ще називають японським більярдом. Її далекий родич, французька «багатель», з’явився у 1777 році на святі для Людовика XVI. З неї згодом виросли пінбол і пачинко 🤍');
  d.setRangeLineHeight(0, d.characters.length, { unit: 'PIXELS', value: 64 });
  out.push('facts: ' + f4.name + ', text ' + d.height / 64 + ' lines');
  // anything else still saying it
  const left = page.findAll(n => n.type === 'TEXT' && /Японськ\\S* більярд/.test(n.characters)).map(n => n.id + ' «' + n.characters.slice(0, 60) + '»');
  out.push('still mentions: ' + (left.join(' | ') || 'none'));
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
