// Compare the Figma import frame with the dump it was built from (detects manual edits).
import fs from 'fs';
const d = JSON.parse(fs.readFileSync(new URL('./dump.json', import.meta.url), 'utf8'));
const cnt = (n) => 1 + (n.children || []).reduce((s, c) => s + cnt(c), 0);
const txt = (n) => (n.t === 'text' ? [n.chars] : (n.children || []).flatMap(txt));
const want = {};
for (const c of d.root.children) want[c.name] = { n: cnt(c) - 1, t: txt(c).join('|') };
const code = `
  const want = ${JSON.stringify(want)};
  const LS = String.fromCharCode(8232);
  const norm = (s) => s.split(LS).join(' ');
  const root = figma.root.children.find(p => p.name === 'Сайт').findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === 'home')[0];
  const out = {};
  for (const c of root.children) {
    const all = c.findAll(() => true);
    const t = all.filter(x => x.type === 'TEXT').map(x => x.characters).join('|');
    const w = want[c.name];
    // svg imports expand into many vectors, so compare frames/texts/images only
    out[c.name] = !w ? 'NEW/RENAMED' : norm(w.t) === norm(t) ? 'texts same' : 'TEXT DIFF';
  }
  return { children: root.children.length, wantChildren: Object.keys(want).length, out, rootH: root.height, edited: root.getPluginData('edited') };
`;
const r = await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
console.log(JSON.stringify((await r.json()).value, null, 1));
