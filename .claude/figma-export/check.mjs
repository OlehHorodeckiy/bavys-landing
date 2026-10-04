// Even-values audit of import frames: odd font sizes / line heights and fractional geometry.
const marks = process.argv[2].split(',');
const code = `
  const out = [];
  for (const mark of ${JSON.stringify(marks)}) {
    const root = figma.root.children.find(p => p.name === 'Сайт').findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === mark)[0];
    if (!root) { out.push(mark + ': missing'); continue; }
    let odd = [], frac = 0;
    for (const n of root.findAll(() => true).concat(root)) {
      if (n.type !== 'VECTOR' && n.type !== 'GROUP') for (const k of ['x', 'y', 'width', 'height']) if (n[k] % 1) frac++; // icon paths keep their own geometry
      if (n.type === 'TEXT') {
        const fs = n.fontSize, lh = n.lineHeight;
        if (typeof fs === 'number' && fs % 2) odd.push(n.characters.slice(0, 40) + ' fs ' + fs);
        if (lh && lh.unit === 'PIXELS' && lh.value % 2) odd.push(n.characters.slice(0, 40) + ' lh ' + lh.value);
      }
    }
    out.push(root.name + ' ' + root.x + ',' + root.y + ' ' + root.width + 'x' + root.height + ' odd: ' + odd.length + ' fractional: ' + frac + (odd.length ? ' ' + JSON.stringify(odd.slice(0, 5)) : ''));
  }
  return out.join('\\n');
`;
const r = await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
const j = await r.json();
console.log(j.result ?? JSON.stringify(j));
