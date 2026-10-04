// Teaser with pictures: match pictures to copy (swap 2↔3, 4↔5), drop the hints, stronger top shade (the user's 1154 one),
// and give «Є!» / «Мимо!» the big 120 size.
const code = `
  for (const s of ['Regular', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const sec = await figma.getNodeByIdAsync('1521:1237');
  const F = sec.children.filter(n => n.type === 'FRAME');
  const swap = (a, b) => { const fa = JSON.parse(JSON.stringify(F[a].fills)), fb = JSON.parse(JSON.stringify(F[b].fills)); F[a].fills = fb; F[b].fills = fa; };
  swap(1, 2); swap(3, 4);
  const games = figma.currentPage.children.find(n => n.getPluginData('bavys-stories'));
  const jp = games.children.find(f => f.name.endsWith('Японський більярд')).children.find(c => c.name === 'Rectangle 1430106908');
  const out = [];
  F.forEach((f, i) => {
    for (const h of f.findAll(n => n.name === 'Підказка — видалити')) h.remove();
    const shade = f.children.find(c => c.name === 'Rectangle 1430106908');
    shade.fills = jp.fills; shade.resizeWithoutConstraints(jp.width, jp.height); shade.x = jp.x; shade.y = jp.y;
    const box = f.findOne(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL');
    const t = box.findOne(n => n.type === 'TEXT');
    if (i === 2) {
      const s = t.characters;
      for (const w of ['«Є!» 💥', '«Мимо!» 😏']) {
        const a = s.indexOf(w); if (a < 0) continue;
        t.setRangeFontSize(a, a + w.length, 120);
        t.setRangeLineHeight(a, a + w.length, { unit: 'PIXELS', value: 136 });
      }
    }
    out.push(f.name + ': text ends at ' + (box.y + box.height));
  });
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
