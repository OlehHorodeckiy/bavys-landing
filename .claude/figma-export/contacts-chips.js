// 1) real phone everywhere (+ links), 2) mobile catalog chips start at 20 like the gallery
const PHONE = '+38 (063) 993-16-76', TEL = 'tel:+380639931676', IG = 'https://www.instagram.com/bavys.lviv';
const page = figma.currentPage, log = [];
const loadAll = async (t) => { for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f); };
let n = 0;
for (const t of page.findAll((x) => x.type === 'TEXT' && x.characters.includes('+38 (000) 000-00-00'))) {
  await loadAll(t);
  const i = t.characters.indexOf('+38 (000) 000-00-00');
  t.insertCharacters(i + 19, PHONE, 'BEFORE'); t.deleteCharacters(i, i + 19);
  if (t.characters === PHONE) t.hyperlink = { type: 'URL', value: TEL };
  n++;
}
log.push('phone ' + n);
for (const t of page.findAll((x) => x.type === 'TEXT' && x.characters === '@bavys.lviv')) { t.hyperlink = { type: 'URL', value: IG }; }
for (const t of page.findAll((x) => x.type === 'TEXT' && x.characters === '+38 (063) 993-16-76')) { t.hyperlink = { type: 'URL', value: TEL }; }

// chips
const bar = await figma.getNodeByIdAsync('1554:13682');
const tpl = bar.children[0];
await figma.loadFontAsync({ family: 'Comfortaa', style: 'Bold' });
const labels = ['Усі ігри · 16', 'Корпоративи', 'Весілля', 'Дні народження', 'Фестивалі', 'Сімейні', 'Надворі', 'Для дітей'];
const old = bar.children.slice();
let x = 20;
for (let i = 0; i < labels.length; i++) {
  const c = tpl.clone(); bar.appendChild(c);
  const t = c.findOne((k) => k.type === 'TEXT');
  t.characters = labels[i]; t.textAutoResize = 'WIDTH_AND_HEIGHT';
  const w = Math.ceil(t.width); const W = w + 40 + ((w + 40) % 2);
  c.resize(W, 44); t.x = 20; t.y = 14; c.x = x; c.y = 0; x += W + 8;
  const active = i === 0;
  c.fills = [{ type: 'SOLID', color: active ? { r: 0x86 / 255, g: 0x64 / 255, b: 0x52 / 255 } : { r: 1, g: 1, b: 1 } }];
  t.fills = [{ type: 'SOLID', color: active ? { r: 1, g: 1, b: 1 } : { r: 0x6b / 255, g: 0x58 / 255, b: 0x4e / 255 } }];
}
old.forEach((o) => o.remove());
bar.x = 0; bar.resize(390, 44); bar.clipsContent = true;
log.push('chips end ' + x);
return log.join(' | ');
