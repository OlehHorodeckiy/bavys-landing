// «Японський більярд» teaser: 4 stories cloned from the user's finished «Морський бій» teaser frames, copy swapped,
// photo left for the user. Accent group (10° tilt) keeps one big line.
const code = `
  await figma.loadFontAsync({ family: 'Comfortaa', style: 'Bold' });
  const page = figma.root.children.find(p => p.name === 'UI');
  for (const n of page.children.filter(n => n.getPluginData('bavys-teaser-jb'))) n.remove();
  const src = await figma.getNodeByIdAsync('1521:1237');
  const T = (id) => figma.getNodeByIdAsync(id);
  const sec = figma.createSection();
  sec.name = 'Сторіз — тизер «Японський більярд» (4 сторіз, встав фони)';
  sec.setPluginData('bavys-teaser-jb', '1');
  sec.fills = src.fills;
  sec.x = src.x; sec.y = src.y + (src.height + 200) * 2;
  sec.resizeWithoutConstraints(4 * 1180 + 100, 2120);
  const plan = [
    ['1521:1244', 'Тизер 1 · Японський більярд', { '1521:1248': 'Більярд, але без кия? 🤔\\nТак, таке буває 🎱' }],
    ['1521:1250', 'Тизер 2 · Японський більярд', { '1521:1321': 'Котиш кульку по доріжці…\\nі цілишся', '1521:1322': 'в лунку 🎯', '1521:1323': null, '1521:1324': null }],
    ['1521:1250', 'Тизер 3 · Японський більярд', { '1521:1321': '10, 20, 50, 80…\\nі одна лунка на', '1521:1322': '100 очок 😎', '1521:1323': null, '1521:1324': null }],
    ['1521:1262', 'Тизер 4 — опитування · Японський більярд', { '1521:1266': 'Скільки очок\\nнаб’єш з першої\\nспроби? 🎱' }],
  ];
  const pathOf = (root, n) => { const p = []; while (n !== root) { p.unshift(n.parent.children.indexOf(n)); n = n.parent; } return p; };
  const out = [];
  for (let i = 0; i < plan.length; i++) {
    const [id, name, texts] = plan[i];
    const f0 = await T(id);
    const f = f0.clone(); sec.appendChild(f); f.x = 100 + i * 1180; f.y = 100; f.name = name;
    const pairs = [];
    for (const [tid, val] of Object.entries(texts)) { let n = f; for (const k of pathOf(f0, await T(tid))) n = n.children[k]; pairs.push([n, val]); }
    for (const [n, val] of pairs) { if (val === null) n.remove(); else n.characters = val; }
    const g = f.findOne(n => n.type === 'FRAME' && Math.round(n.rotation) === 10);
    if (g) g.y = 740;
    f.fills = [{ type: 'SOLID', color: { r: 0.17, g: 0.16, b: 0.12 } }];
    const h = figma.createText();
    h.fontName = { family: 'Comfortaa', style: 'Bold' };
    h.characters = 'Фон 1080×1920: встав картинку у Fill фрейму\\n(видали цей текст)';
    h.fontSize = 32; h.lineHeight = { unit: 'PIXELS', value: 48 }; h.textAlignHorizontal = 'CENTER';
    h.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.5 }];
    h.name = 'Підказка — видалити';
    f.appendChild(h); h.x = Math.round((1080 - h.width) / 4) * 2; h.y = 1560;
    out.push(name + ' ' + f.id + ': ' + f.findAll(n => n.type === 'TEXT' && n.name !== 'Підказка — видалити').map(t => t.characters.replace(/\\n/g, ' / ') + ' [' + t.fontSize + ', h' + Math.round(t.height) + ']').join(' + '));
  }
  figma.viewport.scrollAndZoomIntoView([sec]);
  return { t: out.join('\\n'), img: figma.base64Encode(await sec.exportAsync({ format: 'JPG', constraint: { type: 'WIDTH', value: 2400 } })) };
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
if (!j.value) { console.log(JSON.stringify(j)); process.exit(1); }
(await import('fs')).writeFileSync(process.argv[2], Buffer.from(j.value.img, 'base64'));
console.log(j.value.t);
