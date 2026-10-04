// Two text layouts for the teaser, built on the user's pictures, as sections under the user's own (left untouched).
const S = 64, L = 100;
const A = [
  [['Пам’ятаєте гру,', L], ['в яку ми могли грати\nгодинами в дитинстві? 👀', S]],
  [['Де потрібно було\nтихенько сидіти,\nробити хід і казати:', S], ['«А якщо\nось сюди?..» 👀', L]],
  [['А потім найулюбленіше:', S], ['«Є!» 💥', L], ['або', S], ['«Мимо!» 😏', L]],
  [['Ми вирішили повернути\nцю гру…\nале тепер вона стала', S], ['великою і зовсім\nне дитячою 👀', L]],
  null,
];
const B = [
  [['Пам’ятаєте гру,\nв яку ми могли грати\nгодинами в дитинстві? 👀', S]],
  [['Де потрібно було\nтихенько сидіти,\nробити хід і казати:\n«А якщо ось сюди?..» 👀', S]],
  [['А потім найулюбленіше:\n«Є!» 💥\nабо\n«Мимо!» 😏', S]],
  [['Ми вирішили\nповернути цю гру…\nале тепер вона стала\nвеликою і зовсім\nне дитячою 👀', S]],
  null,
];
const code = `
  const VARS = [['A', 'Тизер — варіант A: великі й малі рядки по центру (як «Наша нова гра / Бірпонг»)', ${JSON.stringify(A)}],
                ['B', 'Тизер — варіант B: увесь текст 64 по центру', ${JSON.stringify(B)}]];
  await figma.loadFontAsync({ family: 'Comfortaa', style: 'Bold' });
  const page = figma.root.children.find(p => p.name === 'UI');
  for (const n of page.children.filter(n => n.getPluginData('bavys-teaser-var'))) n.remove();
  const src = await figma.getNodeByIdAsync('1521:1237');
  const frames = src.children.filter(n => n.type === 'FRAME');
  const out = [];
  VARS.forEach(([key, name, spec], v) => {
    const sec = figma.createSection();
    sec.name = name; sec.setPluginData('bavys-teaser-var', key);
    sec.x = src.x; sec.y = src.y + (src.height + 200) * (v + 1);
    sec.resizeWithoutConstraints(src.width, src.height);
    sec.fills = src.fills;
    frames.forEach((f0, i) => {
      const f = f0.clone(); sec.appendChild(f); f.x = f0.x; f.y = f0.y;
      f.name = f0.name.replace('Тизер', 'Тизер ' + key);
      if (!spec[i]) return;
      const box = f.findOne(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL');
      const fills = box.findOne(n => n.type === 'TEXT').fills;
      for (const c of [...box.children]) c.remove();
      box.itemSpacing = spec[i].length > 1 ? 8 : 0;
      box.counterAxisAlignItems = 'CENTER';
      for (const [txt, size] of spec[i]) {
        const t = figma.createText();
        t.fontName = { family: 'Comfortaa', style: 'Bold' };
        t.characters = txt; t.fontSize = size;
        t.lineHeight = { unit: 'PIXELS', value: size === 100 ? 112 : 96 };
        t.letterSpacing = { unit: 'PERCENT', value: -1.953125 };
        t.textAlignHorizontal = 'CENTER'; t.fills = fills; t.name = txt.split('\\n')[0];
        box.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
      }
      box.x = 60; box.y = 150;
      out.push(f.name + ': text 150–' + (150 + box.height));
    });
  });
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
