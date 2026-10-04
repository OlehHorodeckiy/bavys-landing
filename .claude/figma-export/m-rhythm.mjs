// Mobile vertical rhythm inside sections: pill→title 16, title→lead 16, text→text 16, text/title→content 40,
// card→card 24 (tile grids keep 16), anything→button 40, content→link 32.
const code = `
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const SKIP = new Set(['hero', 'not-found', 'site-footer', 'site-header', 'gallery-page', 'cta-section', 'modal']);
  const kind = (r) => {
    const k = r.k[0];
    if (r.k.some(x => x.name === 'pill')) return 'pill';
    if (r.k.some(x => /^btn/.test(x.name))) return 'btn';
    if (k.type === 'TEXT') return k.fontSize >= 24 ? 'title' : (k.fontSize <= 12 ? 'label' : 'text');
    if (k.name === 'a' || /more|link/.test(k.name)) return 'link';
    return 'block';
  };
  const gapFor = (a, b, ra, rb) => {
    if (a === 'pill') return 16;
    if (a === 'label') return 12;
    if (b === 'btn') return 40;
    if (b === 'link') return 32;
    if (a === 'title' && b === 'text') return 16;
    if (a === 'text' && b === 'text') return 16;
    if (a === 'block' && b === 'block') { const same = ra.k[0].name === rb.k[0].name; return same ? (/spec-tiles|tile/.test(ra.k[0].name) ? 16 : 24) : 40; }
    if (a === 'link' || a === 'btn') return 40;
    return 40;
  };
  const log = [];
  for (const fr of site.findAll(n => n.type === 'FRAME' && /^m-/.test(n.getPluginData('bavys-import')))) {
    if (/menu|popup/.test(fr.getPluginData('bavys-import'))) continue;
    for (const s of fr.children) {
      if (SKIP.has(s.name) || s.getPluginData('iphone') || !('children' in s)) continue;
      const ks = s.children.filter(k => k.visible && !/__bg$|^media$/.test(k.name) && !(k.width >= s.width - 1 && k.height >= s.height - 1)).sort((a, b) => a.y - b.y);
      const rows = [];
      for (const k of ks) { const r = rows[rows.length - 1]; if (r && k.y < r.b - 2) { r.k.push(k); r.b = Math.max(r.b, k.y + k.height); } else rows.push({ y: k.y, b: k.y + k.height, k: [k] }); }
      if (rows.length < 2) continue;
      let y = rows[0].y; const changes = [];
      rows.forEach((r, i) => {
        if (i) { const g = gapFor(kind(rows[i - 1]), kind(r), rows[i - 1], r); y = y + g; }
        const d = y - r.y; if (d) { for (const k of r.k) k.y += d; changes.push(d); }
        y = y + (r.b - r.y);
      });
      if (changes.length) log.push(fr.name.slice(0, 12) + ' / ' + s.name + ' moved ' + changes.length);
    }
  }
  return log.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 400));
