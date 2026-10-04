// Lay out the mobile screens in one labelled section «Бавись — мобілка» on «Сайт».
const SCREENS = [
  ['m-home', 'Головна', '/'], ['m-menu', 'Меню', 'кнопка ≡ у шапці'], ['m-games', 'Каталог ігор', '/#/games'],
  ['m-game', 'Сторінка гри', '/#/games/velyka-dzhenga'], ['m-gallery', 'Галерея', '/#/gallery'], ['m-blog', 'Блог', '/#/blog'],
  ['m-article', 'Стаття', '/#/blog/…'], ['m-about', 'Про нас', '/#/about'], ['m-contacts', 'Контакти', '/#/contacts'],
  ['m-404', '404', 'неіснуюча адреса'], ['m-popup', 'Попап бронювання', 'усі кнопки «Забронювати»'],
];
const code = `
  const SCREENS = ${JSON.stringify(SCREENS)};
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => [{ type: 'SOLID', color: rgb(h) }];
  const site = figma.root.children.find(p => p.name === 'Сайт'); await figma.setCurrentPageAsync(site);
  for (const n of site.children.filter(n => n.getPluginData('bavys-layout') === 'mobile')) { for (const c of [...n.children]) if (c.getPluginData('bavys-import')) site.appendChild(c); n.remove(); }
  const text = (p, chars, size, lh, style, color, x, y, w) => { const t = figma.createText(); p.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars; t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t; };
  const sec = figma.createSection(); sec.name = 'Бавись — мобілка'; sec.setPluginData('bavys-layout', 'mobile'); sec.fills = solid('#f9f6f3');
  let bottom = 0; for (const n of site.children) if (n !== sec && !n.getPluginData('bavys-import')) bottom = Math.max(bottom, n.y + n.height);
  sec.x = 0; sec.y = Math.ceil((bottom + 800) / 400) * 400;
  const PAD = 200, W = 390, GAP = 120, TOP = 560;
  const h = text(sec, 'Бавись — мобілка', 120, 136, 'Bold', '#2b1003', PAD, PAD);
  text(sec, 'iPhone 390 · ' + SCREENS.length + ' екранів · оновлено 3 жовтня 2026', 36, 48, 'Regular', '#6b584e', PAD, PAD + 152);
  let maxH = 0;
  SCREENS.forEach(([m, name, route], i) => {
    const f = site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === m)[0]; if (!f) return;
    const x = PAD + i * (W + GAP);
    const no = String(i + 1).padStart(2, '0');
    const t = text(sec, no + '  ' + name, 28, 36, 'Bold', '#2b1003', x, TOP, W); t.setRangeFills(0, 2, solid('#c78460'));
    text(sec, route, 18, 24, 'Regular', '#c78460', x, TOP + 44, W);
    f.name = no + ' ' + name + ' — 390'; sec.appendChild(f); f.x = x; f.y = TOP + 112; maxH = Math.max(maxH, f.height);
  });
  sec.resizeWithoutConstraints(PAD * 2 + SCREENS.length * W + (SCREENS.length - 1) * GAP, Math.ceil((TOP + 112 + maxH + PAD) / 2) * 2);
  figma.viewport.scrollAndZoomIntoView([sec]);
  return sec.x + ',' + sec.y + ' ' + sec.width + 'x' + sec.height;
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 300));
