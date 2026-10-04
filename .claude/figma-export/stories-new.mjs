// Four story frames for the new games, cloned from «Instagram story - 31» (Корнхол); the photo is left for the user.
const GAMES = [
  ['Морський бій', 'Легендарна гра у великому дерев’яному форматі! Розстав кораблі, називай клітинки й топи флот суперника. Грають двоє — вболівають усі.'],
  ['Китайська стіна', 'Виймай цеглинки зі стіни по одній і не дай своєму тигру впасти! Гра на витримку, точність і холодну голову.'],
  ['Японський більярд', 'Котни кульку по доріжці й влуч у лунку з очками — від 10 до 100! Хто набере більше, той і виграв.'],
  ['Кільцекид щит', 'Накидай кільця на гачки щита й збирай очки — від 10 до 100 за кидок! Влучність, азарт і веселощі для всіх.'],
];
const code = `
  const GAMES = ${JSON.stringify(GAMES)};
  const page = figma.root.children.find(p => p.name === 'UI');
  await figma.setCurrentPageAsync(page);
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  // drop an earlier run
  for (const n of page.children.filter(n => n.getPluginData('bavys-stories'))) n.remove();
  const src = await figma.getNodeByIdAsync('1518:109');
  const X0 = -9870, Y0 = 7464, STEP = 1180;
  const sec = figma.createSection();
  sec.name = 'Сторіз — 4 нові ігри (встав картинки)';
  sec.setPluginData('bavys-stories', '1');
  sec.x = X0 - 100; sec.y = Y0 - 100;
  sec.resizeWithoutConstraints(GAMES.length * STEP - 100 + 200, 1920 + 200);
  const made = [];
  GAMES.forEach(([title, text], i) => {
    const f = src.clone();
    f.name = 'Instagram story — ' + title;
    sec.appendChild(f); f.x = 100 + i * STEP; f.y = 100;
    const bg = f.findOne(n => n.name.startsWith('Gemini_Generated_Image') && n.type === 'RECTANGLE');
    bg.name = 'Фото — ' + title + ' (1080×1920, встав сюди)';
    bg.fills = [{ type: 'SOLID', color: { r: 0.17, g: 0.16, b: 0.12 } }];
    const t = f.findOne(n => n.type === 'TEXT' && n.fontSize === 120);
    t.characters = title;
    const d = f.findOne(n => n.type === 'TEXT' && n.fontSize === 40);
    d.characters = text;
    // hint in the middle of the photo area — delete after the picture is in
    const h = figma.createText();
    h.fontName = { family: 'Comfortaa', style: 'Bold' };
    h.characters = 'Сюди картинку 1080×1920\\n(видали цей текст)';
    h.fontSize = 40; h.lineHeight = { unit: 'PIXELS', value: 64 };
    h.textAlignHorizontal = 'CENTER';
    h.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.5 }];
    h.name = 'Підказка — видалити';
    f.insertChild(f.children.indexOf(bg) + 1, h);
    h.x = Math.round((1080 - h.width) / 2 / 2) * 2; h.y = 1100;
    made.push(f.name + ' ' + f.id);
  });
  figma.viewport.scrollAndZoomIntoView([sec]);
  return made.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
