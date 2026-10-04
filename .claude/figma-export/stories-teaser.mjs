// Five teaser stories (Морський бій) cloned from the user's frame «74» (centred text on a photo); photo left for the user.
const STORIES = [
  'Пам’ятаєте гру, в яку ми могли грати годинами в дитинстві? 👀',
  'Де потрібно було тихенько сидіти, робити хід і казати:\n«А якщо ось сюди?..» 👀',
  'А потім найулюбленіше:\n«Є!» 💥\nабо\n«Мимо!» 😏',
  'Ми вирішили повернути цю гру…\nале тепер вона стала великою і зовсім не дитячою 👀',
  'Вже здогадались, що це?',
];
const POLL = ['Так 👀', 'Поки ні, давайте підказку'];
const code = `
  const STORIES = ${JSON.stringify(STORIES)}, POLL = ${JSON.stringify(POLL)};
  const page = figma.root.children.find(p => p.name === 'UI');
  await figma.setCurrentPageAsync(page);
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  for (const n of page.children.filter(n => n.getPluginData('bavys-teaser'))) n.remove();
  const src = await figma.getNodeByIdAsync('1445:124');
  const DEEP = { r: 0x2b / 255, g: 0x10 / 255, b: 0x03 / 255 };
  const STEP = 1180, X0 = -9850, Y0 = 7364 + 2120 + 200;
  const sec = figma.createSection();
  sec.name = 'Сторіз — тизер «Морський бій» (5 сторіз, встав фони)';
  sec.setPluginData('bavys-teaser', '1');
  sec.x = X0; sec.y = Y0;
  sec.resizeWithoutConstraints(STORIES.length * STEP - 100 + 200, 1920 + 200);
  const text = (chars, size, style, color, opacity = 1) => {
    const t = figma.createText();
    t.fontName = { family: 'Comfortaa', style };
    t.characters = chars; t.fontSize = size;
    t.lineHeight = { unit: 'PIXELS', value: Math.round(size * 1.5 / 2) * 2 };
    t.fills = [{ type: 'SOLID', color, opacity }];
    return t;
  };
  const made = [];
  STORIES.forEach((copy, i) => {
    const f = src.clone();
    f.name = 'Тизер ' + (i + 1) + (i === 4 ? ' — опитування' : '') + ' · Морський бій';
    sec.appendChild(f); f.x = 100 + i * STEP; f.y = 100;
    f.fills = [{ type: 'SOLID', color: { r: 0.17, g: 0.16, b: 0.12 } }];
    const box = f.findOne(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL');
    const t = box.findOne(n => n.type === 'TEXT');
    t.characters = copy;
    if (i === 4) {
      // stand-in for Instagram's poll sticker, so the layout shows where it goes
      const card = figma.createFrame();
      card.name = 'Стікер «Опитування» (додати в Instagram, цей шар видалити)';
      card.layoutMode = 'VERTICAL'; card.itemSpacing = 16;
      card.paddingTop = card.paddingBottom = card.paddingLeft = card.paddingRight = 32;
      card.primaryAxisSizingMode = 'AUTO'; card.counterAxisSizingMode = 'FIXED';
      card.resize(720, 100); card.cornerRadius = 32;
      card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      for (const o of POLL) {
        const row = figma.createFrame();
        row.name = 'Варіант — ' + o;
        row.layoutMode = 'HORIZONTAL'; row.primaryAxisAlignItems = 'CENTER'; row.counterAxisAlignItems = 'CENTER';
        row.paddingTop = row.paddingBottom = 20; row.paddingLeft = row.paddingRight = 32;
        row.cornerRadius = 44;
        row.fills = [{ type: 'SOLID', color: { r: 0xf9 / 255, g: 0xf6 / 255, b: 0xf3 / 255 } }];
        row.appendChild(text(o, 36, 'Bold', DEEP));
        card.appendChild(row);
        row.layoutSizingHorizontal = 'FILL'; row.layoutSizingVertical = 'HUG';
      }
      box.appendChild(card);
      box.counterAxisAlignItems = 'CENTER';
    }
    box.y = Math.round((1920 - box.height) / 2 / 2) * 2;
    const hint = text('Фон 1080×1920: встав картинку у Fill фрейму\\n(видали цей текст)', 32, 'Bold', { r: 1, g: 1, b: 1 }, 0.5);
    hint.name = 'Підказка — видалити';
    hint.textAlignHorizontal = 'CENTER';
    f.appendChild(hint);
    hint.x = Math.round((1080 - hint.width) / 2 / 2) * 2; hint.y = 1560;
    made.push(f.name + ' ' + f.id + ' text h ' + box.height);
  });
  figma.viewport.scrollAndZoomIntoView([sec]);
  return made.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
