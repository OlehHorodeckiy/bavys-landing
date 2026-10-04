// Pull original image bytes out of Figma for the push, one image per request.
import fs from 'fs';
const post = async (code) => { const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json(); if (!j.ok) throw new Error(j.error); return j.value; };
const FILL = {
  'card-chotyry-v-riad': '1548:12188', 'card-kornkhol': '1548:12194', 'card-galaktyka': '1548:12196', 'card-balans': '1548:12199',
  'card-kiltsekyd': '1548:12201', 'card-velyka-dzhenga': '1548:12204', 'card-rybalka': '1548:12206', 'card-v-odni-vorota': '1548:12207',
  'card-mysholovka': '1548:12208', 'card-shaleni-kameni': '1548:12209', 'card-na-hachok': '1548:12211', 'card-velykyi-morskyi-bii': '1548:12213',
  'card-velyka-kytaiska-stina': '1548:12214', 'card-kulbutto': '1548:12215', 'card-kiltsekyd-shchyt': '1549:12216', 'card-birponh': '1550:12223',
  'cta-lawn': '1539:3891', 'footer-garden': '1510:33327', 'game-hero-lawn': '1518:444',
};
for (const [k, id] of Object.entries(FILL)) {
  if (fs.existsSync(`raw/${k}.bin`)) continue;
  const b = await post(`const n = await figma.getNodeByIdAsync(${JSON.stringify(id)}); const f = n.fills.find(x => x.type === 'IMAGE'); const sz = await figma.getImageByHash(f.imageHash).getSizeAsync();
    if (sz.width * sz.height <= 4.2e6) return figma.base64Encode(await figma.getImageByHash(f.imageHash).getBytesAsync());
    const r = figma.createRectangle(); const k = Math.sqrt(4e6 / (sz.width * sz.height)); r.resize(Math.round(sz.width * k), Math.round(sz.height * k)); r.fills = [{ type: 'IMAGE', imageHash: f.imageHash, scaleMode: 'FILL' }];
    const out = figma.base64Encode(await r.exportAsync({ format: 'JPG', constraint: { type: 'SCALE', value: 1 } })); r.remove(); return out;`);
  fs.writeFileSync(`raw/${k}.bin`, Buffer.from(b, 'base64')); console.log(k, Buffer.from(b, 'base64').length);
}
for (const [k, mark, name] of [['about-lawn', 'page-about', 'about-intro'], ['nf-lawn', 'page-404', 'hero']]) {
  if (fs.existsSync(`raw/${k}.bin`)) continue;
  const b = await post(`const site = figma.root.children.find(p => p.name === 'Сайт'); const fr = site.findAll(x => x.type === 'FRAME' && x.getPluginData('bavys-import') === ${JSON.stringify(mark)})[0];
    const s = fr.children.find(c => c.name === ${JSON.stringify(name)}); const f = (s.fills || []).find(x => x.type === 'IMAGE'); if (!f) return '';
    return f.imageHash + '|' + figma.base64Encode(await figma.getImageByHash(f.imageHash).getBytesAsync());`);
  if (!b) { console.log(k, 'none'); continue; }
  const [h, d] = b.split('|'); fs.writeFileSync(`raw/${k}.bin`, Buffer.from(d, 'base64')); console.log(k, h.slice(0, 8), Buffer.from(d, 'base64').length);
}
for (const [k, nm] of [['game-velykyi-morskyi-bii', 'Великий морський бій'], ['game-velyka-kytaiska-stina', 'Велика китайська стіна'], ['game-kiltsekyd-shchyt', 'Кільцекид щит'], ['game-birponh', 'Бірпонг']]) {
  if (fs.existsSync(`raw/${k}.bin`)) continue;
  const b = await post(`const list = await figma.getNodeByIdAsync('1510:33427'); const li = list.children.find(c => c.name === ${JSON.stringify('li · ' + nm)});
    const r = li.findOne(n => n.type === 'RECTANGLE'); const t = figma.createRectangle(); t.resize(480, 606); t.fills = r.fills;
    const out = figma.base64Encode(await t.exportAsync({ format: 'PNG' })); t.remove(); return out;`);
  fs.writeFileSync(`raw/${k}.bin`, Buffer.from(b, 'base64')); console.log(k, Buffer.from(b, 'base64').length);
}
