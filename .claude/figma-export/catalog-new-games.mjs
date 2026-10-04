// Add the four new games (photos from the user's stories) to the catalogue grid in «02 Каталог ігор».
const GAMES = [
  ['Великий морський бій', 'Розстав кораблі на великому дерев’яному полі й топи флот суперника.', 'Корпоратив', '2', '1518:1099', 0.42],
  ['Велика китайська стіна', 'Виймай цеглинки по одній і не дай своєму тигру впасти.', 'День народження', '2', '1518:1118', 0.42],
  ['Кульбутто', 'Котни кульку по доріжці й влуч у лунку з очками від 10 до 100.', 'Сімейне свято', '1+', '1520:1181', 0.5],
  ['Кільцекид щит', 'Накидай кільця на гачки щита й збирай від 10 до 100 очок.', 'Весілля', '2+', 'frame:1518:1155', 0.36],
];
const code = `
  for (const s of ['Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const cat = await N('1510:33541'), grid = await N('1510:33560'), catalog = grid.parent;
  for (const c of grid.children.filter(c => c.getPluginData('new-game'))) c.remove();
  const tpl = await N('1510:33561');
  const GAMES = ${JSON.stringify(GAMES)};
  const W = [0, 435, 869];
  const ROW = 476, GAP = 48;
  let i = grid.children.length; // 11 existing
  const out = [];
  for (const [name, desc, chip, players, src, ty] of GAMES) {
    // image: a rectangle on the UI page, or the story frame's own fill
    const node = src.startsWith('frame:') ? await N(src.slice(6)) : await N(src);
    const imgFill = (node.fills || []).find(f => f.type === 'IMAGE');
    const size = await figma.getImageByHash(imgFill.imageHash).getSizeAsync();
    const card = tpl.clone(); grid.appendChild(card); card.setPluginData('new-game', name);
    const col = i % 3, row = Math.floor(i / 3);
    card.x = W[col]; card.y = row < 4 ? [0, 525, 1049, 1574][row] : 1574 + 476 + GAP + (row - 4) * (ROW + GAP);
    const texts = card.findAll(n => n.type === 'TEXT');
    const tt = texts.find(t => t.fontSize === 24); tt.characters = name; tt.textAutoResize = 'WIDTH_AND_HEIGHT';
    texts.find(t => t.fontSize === 16).characters = desc;
    const chips = card.findAll(n => n.name === 'chip');
    chips[0].findOne(n => n.type === 'TEXT').characters = chip;
    chips[1].findOne(n => n.type === 'TEXT').characters = players;
    // chips hug their text: re-measure widths (even)
    for (const c of chips) { const t = c.findOne(n => n.type === 'TEXT'); t.textAutoResize = 'WIDTH_AND_HEIGHT';
      c.resize(Math.ceil((t.x + t.width + 12) / 2) * 2, c.height); }
    chips[1].x = card.findOne(n => n.name === 'game-card__media').width - 20 - chips[1].width;
    // photo: lower part of the vertical story frame, where the game stands
    const img = card.findOne(n => n.type === 'RECTANGLE');
    const ar = img.width / img.height, sy = Math.min(1, (size.width / ar) / size.height);
    img.fills = [{ type: 'IMAGE', imageHash: imgFill.imageHash, scaleMode: 'CROP', imageTransform: [[1, 0, 0], [0, sy, Math.min(ty, 1 - sy)]] }];
    img.name = 'Image · ' + name;
    out.push(name + ' @' + card.x + ',' + card.y);
    i++;
  }
  const last = grid.children.reduce((m, c) => Math.max(m, c.y + c.height), 0);
  const oldGridH = grid.height; grid.resize(1280, Math.ceil(last / 2) * 2);
  const dGrid = grid.height - oldGridH;
  for (const c of catalog.children) if (c !== grid && c.y > grid.y) c.y += dGrid;
  catalog.resize(1440, catalog.height + dGrid);
  for (const c of cat.children) if (c.y > catalog.y && c !== catalog) c.y += dGrid;
  cat.resize(1440, cat.height + dGrid);
  // filter counter
  const all = cat.findOne(n => n.type === 'TEXT' && n.characters.startsWith('Усі ігри'));
  if (all) { all.characters = 'Усі ігри · ' + grid.children.length; }
  return out.join('\\n') + '\\ngrid ' + grid.height + ', page ' + cat.height + ', games ' + grid.children.length;
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
