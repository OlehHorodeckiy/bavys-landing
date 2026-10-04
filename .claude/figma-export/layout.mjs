// Lay out every imported page in one labelled section on «Сайт» (+ a section for design variants).
const PAGES = [
  ['home', 'Головна', '/', 'Hero з аркою ігор, про нас, каталог, як це працює, події, галерея, заявка'],
  ['page-games', 'Каталог ігор', '/#/games', 'Усі 11 ігор, фільтр за подією'],
  ['page-game', 'Сторінка гри', '/#/games/velyka-dzhenga', 'Шаблон на прикладі Великої Дженги: правила, комплектація, умови оренди'],
  ['page-gallery', 'Галерея', '/#/gallery', 'Фото з подій'],
  ['page-blog', 'Блог', '/#/blog', 'Список статей'],
  ['page-article', 'Стаття', '/#/blog/yak-obraty-igry-dlia-vesillia', 'Шаблон статті на прикладі «Як обрати ігри для весілля»'],
  ['page-about', 'Про нас', '/#/about', 'Історія, принципи, що входить в оренду, 4 кроки'],
  ['page-contacts', 'Контакти', '/#/contacts', 'Форма заявки, телефон, пошта, графік'],
  ['page-404', '404', 'будь-яка неіснуюча адреса', 'Сторінка не знайдена: «Схоже, вежа впала»'],
];
const VARIANTS = [['lab-steps', 'Як це працює — білі картки', '/#/lab/steps (тільки локально)', 'Два варіанти фону: темний і світлий · чекає на вибір']];
const code = `
  const PAGES = ${JSON.stringify(PAGES)}, VARIANTS = ${JSON.stringify(VARIANTS)};
  const site = figma.root.children.find(p => p.name === 'Сайт');
  await figma.setCurrentPageAsync(site);
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
  const DEEP = '#2b1003', INK = '#6b584e', ACCENT = '#c78460', CREAM = '#f9f6f3';
  const PAD = 200, GAP = 160, W = 1440;
  const byMark = (m) => site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === m)[0];

  // drop an earlier layout run
  for (const n of site.children.filter(n => n.getPluginData('bavys-layout'))) {
    for (const c of [...n.children]) if (c.getPluginData('bavys-import')) { site.appendChild(c); }
    n.remove();
  }

  const text = (chars, size, style, color, width) => {
    const t = figma.createText();
    t.fontName = { family: 'Comfortaa', style };
    t.characters = chars;
    t.fontSize = size;
    t.lineHeight = { unit: 'PIXELS', value: Math.round(size * 1.3 / 2) * 2 };
    t.fills = solid(color);
    if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  };
  const stack = (name, gap, kids) => {
    const f = figma.createFrame();
    f.name = name; f.fills = []; f.clipsContent = false;
    f.layoutMode = 'VERTICAL'; f.itemSpacing = gap;
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    for (const k of kids) f.appendChild(k);
    return f;
  };
  const label = (no, name, route, note) => {
    const head = text(no + '  ' + name, 56, 'Bold', DEEP);
    head.setRangeFills(0, no.length, solid(ACCENT));
    const l = stack('Підпис — ' + name, 16, [head, text(route, 28, 'Regular', ACCENT), text(note, 28, 'Regular', INK, W)]);
    return l;
  };
  const section = (name, mark) => {
    const s = figma.createSection();
    s.name = name; s.fills = solid(CREAM);
    s.setPluginData('bavys-layout', mark);
    return s;
  };

  // free space below everything else on the page
  let bottom = 0;
  for (const n of site.children) if (!n.getPluginData('bavys-import')) bottom = Math.max(bottom, n.y + n.height);
  const X0 = 0, Y0 = Math.ceil((bottom + 1200) / 400) * 400;

  const build = (title, subtitle, items, mark, x0, y0) => {
    const s = section(title, mark);
    s.x = x0; s.y = y0;
    const head = stack('Заголовок', 24, [text(title, 120, 'Bold', DEEP), text(subtitle, 36, 'Regular', INK)]);
    s.appendChild(head); head.x = PAD; head.y = PAD;
    const labels = items.map(([m, name, route, note], i) => label(String(i + 1).padStart(2, '0'), name, route, note));
    const labTop = PAD + head.height + 200;
    const labH = Math.max(...labels.map(l => l.height));
    const frameTop = labTop + labH + 64;
    let maxH = 0, placed = [];
    items.forEach(([m, name], i) => {
      const f = byMark(m);
      const x = PAD + i * (W + GAP);
      s.appendChild(labels[i]); labels[i].x = x; labels[i].y = frameTop - 64 - labels[i].height;
      if (!f) { placed.push(name + ' (немає фрейму)'); return; }
      f.name = String(i + 1).padStart(2, '0') + ' ' + name + ' — 1440';
      s.appendChild(f); f.x = x; f.y = frameTop;
      maxH = Math.max(maxH, f.height); placed.push(f.name);
    });
    const w = PAD * 2 + items.length * W + (items.length - 1) * GAP;
    s.resizeWithoutConstraints(w, Math.ceil((frameTop + maxH + PAD) / 2) * 2);
    return { s, placed };
  };

  const a = build('Бавись — сайт', 'Десктоп 1440 · ' + PAGES.length + ' сторінок · оновлено 2 жовтня 2026', PAGES, 'pages', X0, Y0);
  const b = build('Варіанти на вибір', 'Секції, які ще обговорюємо', VARIANTS, 'variants', X0, a.s.y + a.s.height + 400);
  figma.viewport.scrollAndZoomIntoView([a.s, b.s]);
  return JSON.stringify({ pages: [a.s.x, a.s.y, a.s.width, a.s.height], variants: [b.s.x, b.s.y, b.s.width, b.s.height], placed: a.placed.concat(b.placed) });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
console.log(j.value ?? JSON.stringify(j));
