// Home hero strip: back to the evening arch photos, all 16 games, list rendered twice (marquee).
import fs from 'fs';
const DIR = process.argv[2];
const OLD = ['mysholovka', 'rybalka', 'balans', 'chotyry-v-riad', 'kornkhol', 'velyka-dzhenga', 'kiltsekyd', 'galaktyka', 'v-odni-vorota', 'shaleni-kameni', 'na-hachok'];
const NAMES = ['Мишоловка', 'Рибалка', 'Баланс', '4 в ряд', 'Корнхол', 'Велика Дженга', 'Кільцекид', 'Галактика', 'В одні ворота', 'Шалені камені', 'На гачок',
  'Великий морський бій', 'Велика китайська стіна', 'Кульбутто', 'Кільцекид щит', 'Бірпонг'];
const NEWSRC = { 'Великий морський бій': '1518:1099', 'Велика китайська стіна': '1518:1118', 'Кульбутто': '1520:1181', 'Кільцекид щит': 'frame:1518:1155', 'Бірпонг': '1143:186' };
const imgs = OLD.map((s) => fs.readFileSync(`${DIR}/${s}.jpg`).toString('base64'));
const code = `
  const N = (id) => figma.getNodeByIdAsync(id);
  const imgs = ${JSON.stringify(imgs)}, NAMES = ${JSON.stringify(NAMES)}, NEWSRC = ${JSON.stringify(NEWSRC)};
  const fills = [];
  for (const b of imgs) fills.push([{ type: 'IMAGE', imageHash: figma.createImage(figma.base64Decode(b)).hash, scaleMode: 'FILL' }]);
  for (const name of NAMES.slice(11)) {
    const src = NEWSRC[name]; const node = src.startsWith('frame:') ? await N(src.slice(6)) : await N(src);
    const f = node.fills.find(x => x.type === 'IMAGE'); const size = await figma.getImageByHash(f.imageHash).getSizeAsync();
    const sy = Math.min(1, (size.width / (184 / 232)) / size.height);
    fills.push([{ type: 'IMAGE', imageHash: f.imageHash, scaleMode: 'CROP', imageTransform: [[1, 0, 0], [0, sy, Math.min(1 - sy, 0.27)]] }]);
  }
  const list = await N('1510:33427');
  const tpl = list.children[0];
  for (const c of [...list.children].slice(1)) c.remove();
  const total = NAMES.length * 2;
  for (let i = 0; i < total; i++) {
    const li = i === 0 ? tpl : tpl.clone(); if (i) list.appendChild(li);
    li.x = i * 208; li.y = 0; li.name = 'li · ' + NAMES[i % NAMES.length];
    const r = li.findOne(n => n.type === 'RECTANGLE' && n.fills.some(x => x.type === 'IMAGE'));
    r.fills = fills[i % NAMES.length]; r.name = NAMES[i % NAMES.length];
  }
  list.resize(total * 208 - 24, list.height);
  return 'items ' + list.children.length + ', list ' + list.width;
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 400));
