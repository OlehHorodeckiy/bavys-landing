// Measure candidate line layouts: each line must fit the box without an extra wrap.
const tests = JSON.parse(process.argv[2]);
const code = `
  await figma.loadFontAsync({ family: 'Comfortaa', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Comfortaa', style: 'Regular' });
  const out = [];
  for (const [txt, size, style, ls] of ${JSON.stringify(tests)}) {
    const res = [];
    for (const line of txt.split('\\n')) {
      const t = figma.createText();
      t.fontName = { family: 'Comfortaa', style }; t.characters = line; t.fontSize = size;
      t.letterSpacing = { unit: 'PERCENT', value: ls };
      res.push(Math.round(t.width)); t.remove();
    }
    out.push(txt.replace(/\\n/g, ' ⏎ ') + '  →  ' + res.join(', '));
  }
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
