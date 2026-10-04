// «Велика китайська стіна» teaser: 4 stories cloned from the user's finished «Морський бій» teaser frames (same shade,
// type and the 10° accent), copy swapped, photo left for the user.
const code = `
  await figma.loadFontAsync({ family: 'Comfortaa', style: 'Bold' });
  const page = figma.root.children.find(p => p.name === 'UI');
  for (const n of page.children.filter(n => n.getPluginData('bavys-teaser-wall'))) n.remove();
  const src = await figma.getNodeByIdAsync('1521:1237');
  const T = (id) => figma.getNodeByIdAsync(id);
  const sec = figma.createSection();
  sec.name = 'Сторіз — тизер «Велика китайська стіна» (4 сторіз, встав фони)';
  sec.setPluginData('bavys-teaser-wall', '1');
  sec.fills = src.fills;
  sec.x = src.x; sec.y = src.y + src.height + 200;
  sec.resizeWithoutConstraints(4 * 1180 + 100, 2120);
  const plan = [
    ['1521:1244', 'Тизер 1 · Китайська стіна', { '1521:1248': 'Кажуть, Велику\\nкитайську стіну будували\\nпонад 2000 років…\\nА ми свою зібрали\\nза вечір 😏' }],
    ['1521:1250', 'Тизер 2 · Китайська стіна', { '1521:1321': 'Але є нюанс:\\nна ній сидять', '1521:1322': 'два тигри 🐯🐯', '1521:1323': null, '1521:1324': null }],
    ['1521:1256', 'Тизер 3 · Китайська стіна', { '1521:1260': 'Виймаєш цеглинку\\nза цеглинкою…\\nі молишся,\\nщоб твій тигр не впав 🙏' }],
    ['1521:1262', 'Тизер 4 — опитування · Китайська стіна', { '1521:1266': 'Наважишся\\nвийняти першу\\nцеглинку? 🧱' }],
  ];
  const out = [];
  for (let i = 0; i < plan.length; i++) {
    const [id, name, texts] = plan[i];
    const f0 = await T(id);
    // map original text ids to their paths so the clone's twins can be found
    const pathOf = (root, n) => { const p = []; while (n !== root) { p.unshift(n.parent.children.indexOf(n)); n = n.parent; } return p; };
    const f = f0.clone(); sec.appendChild(f); f.x = 100 + i * 1180; f.y = 100; f.name = name;
    const twin = async (tid) => { const o = await T(tid); const p = pathOf(f0, o); let n = f; for (const k of p) n = n.children[k]; return n; };
    const nodes = [];
    for (const [tid, val] of Object.entries(texts)) nodes.push([await twin(tid), val]);
    for (const [n, val] of nodes) {
      if (val === null) { n.remove(); continue; }
      n.characters = val;
    }
    f.fills = [{ type: 'SOLID', color: { r: 0.17, g: 0.16, b: 0.12 } }];
    const h = figma.createText();
    h.fontName = { family: 'Comfortaa', style: 'Bold' };
    h.characters = 'Фон 1080×1920: встав картинку у Fill фрейму\\n(видали цей текст)';
    h.fontSize = 32; h.lineHeight = { unit: 'PIXELS', value: 48 }; h.textAlignHorizontal = 'CENTER';
    h.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.5 }];
    h.name = 'Підказка — видалити';
    f.appendChild(h); h.x = Math.round((1080 - h.width) / 4) * 2; h.y = 1560;
    out.push(name + ' ' + f.id + ': ' + f.findAll(n => n.type === 'TEXT' && n.name !== 'Підказка — видалити').map(t => t.characters.replace(/\\n/g, ' / ') + ' [' + t.fontSize + ', h' + Math.round(t.height) + ', y' + Math.round(t.absoluteBoundingBox.y - f.absoluteBoundingBox.y) + ']').join(' + '));
  }
  figma.viewport.scrollAndZoomIntoView([sec]);
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
