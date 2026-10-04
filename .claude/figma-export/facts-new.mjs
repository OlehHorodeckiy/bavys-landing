// «Факти» series for the 4 new games, cloned from the user's stories 43 (intro), 44 (fact) and 47 (outro).
// Photos left for the user; line heights pinned to even px (74 → 112, 70 → 106).
const FACTS = [
  ['Звідки взявся\nМорський бій? ⚓', 'Гра з’явилась ще під час Першої світової, тоді в неї грали на папері в клітинку. Перша магазинна версія вийшла у 1931 році в США, а у 1967 кораблі стали пластиковими. У нас вони дерев’яні 🤍'],
  ['Цікавий факт про\nКитайську стіну 🧱', 'Справжня Велика китайська стіна тягнеться на 21 196 км, це більше за половину екватора. Її будували понад 2000 років. Наша трохи менша: 70 цеглинок і два тигри на варті 🐯'],
  ['Хто вигадав\nЯпонський більярд? 🎱', 'Її предок, гра «багатель», з’явився у Франції у 1777 році на святі для короля Людовика XVI. Саме з неї згодом виросли пінбол і японське пачинко 🤍'],
  ['Звідки родом\nКільцекид щит? 🎯', 'За легендою, гру з кільцем і гачком привезли в Англію хрестоносці ще у XII столітті. А дошка-щит з гачками й очками стала класикою ірландських пабів 🍀'],
];
const code = `
  const FACTS = ${JSON.stringify(FACTS)};
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const page = figma.root.children.find(p => p.name === 'UI');
  for (const n of page.children.filter(n => n.getPluginData('bavys-facts-new'))) n.remove();
  const ref = page.children.find(n => n.getPluginData('bavys-teaser-jb'));
  const sec = figma.createSection();
  sec.name = 'Сторіз — факти про 4 нові ігри (6 сторіз, встав фони)';
  sec.setPluginData('bavys-facts-new', '1');
  sec.fills = ref.fills;
  sec.x = ref.x; sec.y = ref.y + ref.height + 200;
  sec.resizeWithoutConstraints(6 * 1180 + 100, 2120);
  const nb = (s) => s.replace(/(^|[\\s(«])([уйівзаоУЙІВЗАО]) /g, '$1$2\\u00A0');
  const DARK = [{ type: 'SOLID', color: { r: 0.17, g: 0.16, b: 0.12 } }];
  const hint = (f) => {
    const h = figma.createText();
    h.fontName = { family: 'Comfortaa', style: 'Bold' };
    h.characters = 'Фон 1080×1920: встав картинку\\n(видали цей текст)';
    h.fontSize = 32; h.lineHeight = { unit: 'PIXELS', value: 48 }; h.textAlignHorizontal = 'CENTER';
    h.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.5 }];
    h.name = 'Підказка — видалити';
    f.appendChild(h); h.x = Math.round((1080 - h.width) / 4) * 2; h.y = 1500;
  };
  const place = async (id, i, name) => {
    const f = (await figma.getNodeByIdAsync(id)).clone();
    sec.appendChild(f); f.x = 100 + i * 1180; f.y = 100; f.name = name; return f;
  };
  const out = [];
  // intro (43): photo lives in the frame fill + a blurred copy in «Rectangle 1430106908»
  const intro = await place('1161:649', 0, 'Факти 1 · Вступ');
  intro.fills = DARK;
  intro.children.find(c => c.name === 'Rectangle 1430106908').fills = [];
  let t = intro.findOne(n => n.type === 'TEXT' && n.fontSize === 74);
  t.characters = 'Знаєш, звідки взялися\\nнаші нові ігри? 🤔'; t.lineHeight = { unit: 'PIXELS', value: 112 };
  intro.findOne(n => n.type === 'TEXT' && n.fontSize === 32).characters = 'Зараз розкажемо ➡️';
  hint(intro); out.push(intro.name + ': ' + t.height);
  // facts (44): photo is the «image …» rectangle
  for (let k = 0; k < FACTS.length; k++) {
    const f = await place('1161:661', k + 1, 'Факти ' + (k + 2) + ' · ' + FACTS[k][0].split('\\n')[1].replace(/ [^ ]+$/, '').replace('?', ''));
    const img = f.children.find(c => c.type === 'RECTANGLE' && c.fills[0] && c.fills[0].type === 'IMAGE');
    img.fills = DARK; img.name = 'Фото (встав сюди)';
    const title = f.findOne(n => n.type === 'TEXT' && n.fontSize === 70);
    title.characters = FACTS[k][0]; title.lineHeight = { unit: 'PIXELS', value: 106 };
    const d = f.findOne(n => n.type === 'TEXT' && n.fontSize === 40);
    d.characters = nb(FACTS[k][1]);
    hint(f); out.push(f.name + ': title ' + title.height + ', text ' + d.height / 64 + ' lines');
  }
  // outro (47)
  const outro = await place('1163:707', 5, 'Факти 6 · Фінал');
  outro.fills = DARK;
  outro.children.find(c => c.name === 'Rectangle 1430106908').fills = [];
  t = outro.findOne(n => n.type === 'TEXT' && n.fontSize === 74);
  t.characters = 'Історії цікаві.\\nАле грати ще цікавіше 😄'; t.lineHeight = { unit: 'PIXELS', value: 112 };
  outro.findOne(n => n.type === 'TEXT' && n.fontSize === 32).characters = 'Замовляй і переконайся сам 🤍';
  hint(outro); out.push(outro.name + ': ' + t.height);
  figma.viewport.scrollAndZoomIntoView([sec]);
  await new Promise(r => setTimeout(r, 1500));
  return { t: out.join('\\n'), img: figma.base64Encode(await sec.exportAsync({ format: 'JPG', constraint: { type: 'WIDTH', value: 3000 } })) };
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
if (!j.value) { console.log(JSON.stringify(j)); process.exit(1); }
(await import('fs')).writeFileSync(process.argv[2], Buffer.from(j.value.img, 'base64'));
console.log(j.value.t);
