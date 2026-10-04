import fs from 'fs';
const post = async (code) => { const r = await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) }); const j = await r.json(); if (!j.ok) throw new Error(j.error); return j.value; };
for (const mark of (process.argv[2] || 'page-games,page-gallery,page-blog').split(',')) {
  const v = await post(`
    const f = figma.root.children.find(p => p.name === 'Сайт').findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === ${JSON.stringify(mark)})[0];
    const texts = f.findAll(n => n.type === 'TEXT');
    const odd = texts.filter(t => t.getStyledTextSegments(['fontSize','lineHeight']).some(s => s.fontSize % 2 || (s.lineHeight.unit === 'PIXELS' && s.lineHeight.value % 2))).length;
    const frac = f.findAll(n => ['FRAME','RECTANGLE','TEXT'].includes(n.type)).filter(n => [n.x,n.y,n.width,n.height].some(v => Math.abs(v-Math.round(v))>0.001)).length;
    const b = await f.exportAsync({ format: 'JPG', constraint: { type: 'WIDTH', value: 360 } });
    return { name: f.name, pos: [f.x, f.y], size: [f.width, f.height], odd, frac, b64: figma.base64Encode(b) };`);
  fs.writeFileSync(new URL(`./${mark}.jpg`, import.meta.url), Buffer.from(v.b64, 'base64'));
  console.log(v.name, v.pos.join(','), v.size.join('x'), 'odd type:', v.odd, 'fractional:', v.frac);
}
