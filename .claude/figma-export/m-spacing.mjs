// Normalise mobile spacing: 20px side margins, 64 top/bottom in sections, 40 from a page title to its content,
// first screens start content 120 below the frame top (58 under the header). Also repairs the popup overlay.
const code = `
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const log = [];
  const shiftKids = (s, d) => { for (const k of s.children) if (!/__bg$|^media$/.test(k.name) && !(k.width >= s.width - 1 && k.height >= s.height - 1 && k.y === 0)) k.y += d; };
  const content = (s) => s.children.filter(k => k.visible && !/__bg$|^media$/.test(k.name) && !(k.width >= s.width - 1 && k.height >= s.height - 1));
  const pad = (s, top, bot) => {
    const ks = content(s); if (!ks.length) return;
    const t = Math.min(...ks.map(k => k.y)); if (top != null && t !== top) shiftKids(s, top - t);
    const b = s.height - Math.max(...content(s).map(k => k.y + k.height));
    if (bot != null && b !== bot) { const nh = s.height + (bot - b); s.resize(s.width, nh); for (const k of s.children) if (/__bg$|^media$/.test(k.name) || (k.width >= s.width - 1 && k.y === 0)) k.resize(k.width, nh); }
  };
  // shrink a block to 350 at x 20, padding inside kept by moving right-anchored children
  const fit = (node, W) => {
    const d = node.width - W; if (d <= 0) return;
    const walk = (n, ow) => { for (const c of ('children' in n ? n.children : [])) { const cw = c.width;
      if (c.x + cw >= ow - 1 && cw > 60) { if (c.type === 'TEXT') { c.textAutoResize = 'HEIGHT'; c.resize(cw - d, c.height); } else { c.resize(cw - d, c.height); walk(c, cw); } }
      else if (c.x > ow / 2) c.x -= d; } };
    const ow = node.width; node.resize(W, node.height); walk(node, ow);
  };
  for (const fr of site.findAll(n => n.type === 'FRAME' && /^m-/.test(n.getPluginData('bavys-import')))) {
    const mark = fr.getPluginData('bavys-import');
    if (mark === 'm-menu') continue;
    if (mark === 'm-popup') {
      const modal = fr.children.find(c => c.name === 'modal'); if (modal) { modal.y = 62; fr.appendChild(modal); for (const c of fr.children.filter(c => c.getPluginData('iphone'))) fr.appendChild(c); log.push('popup modal fixed'); }
      continue;
    }
    const secs = [...fr.children].filter(c => !c.getPluginData('iphone') && c.name !== 'site-header').sort((a, b) => a.y - b.y);
    secs.forEach((s, i) => {
      // side margins: texts and blocks wider than the 350 column
      for (const k of s.children) {
        if (k.type === 'TEXT' && k.x === 20 && k.width > 350) { k.textAutoResize = 'HEIGHT'; k.resize(350, k.height); }
        if (k.type === 'FRAME' && k.x > 0 && k.x < 20 && k.width > 350 && k.x + k.width < 390) { fit(k, 350); k.x = 20; log.push(fr.name.slice(0, 12) + ' fit ' + k.name); }
        if (k.type === 'FRAME' && k.x === 20 && k.width > 350 && k.width < 370) { fit(k, 350); log.push(fr.name.slice(0, 12) + ' fit ' + k.name); }
      }
      if (s.name === 'site-footer' || s.name === 'gallery-page') return;
      const first = i === 0, prev = secs[i - 1];
      if (s.name === 'page-title') { pad(s, 120, ['gallery', 'games'].some(x => mark.endsWith(x)) ? 40 : 0); return; }
      if (first) { pad(s, mark === 'm-about' ? null : 120, null); return; }
      if (prev && prev.name === 'page-title') { pad(s, prev.height - Math.max(...content(prev).map(k => k.y + k.height)) >= 40 ? 0 : 40, s.name === 'catalog' ? 0 : 64); return; }
      if (s.name === 'about-story' || s.name === 'about-service') { pad(s, 64, 64); return; }
      pad(s, 64, s.name === 'catalog' ? 0 : 64);
    });
    // about intro: photos then 64
    if (mark === 'm-about') { const a = secs[0]; const ks = content(a); const b = a.height - Math.max(...ks.map(k => k.y + k.height)); if (b !== 64) { a.resize(390, a.height + 64 - b); for (const k of a.children) if (/__bg$/.test(k.name)) k.resize(390, a.height); } }
    // restack
    let y = 62; for (const s of [...fr.children].filter(c => !c.getPluginData('iphone') && c.name !== 'site-header').sort((a, b) => a.y - b.y)) { if (s.height % 2) s.resize(s.width, s.height + 1); s.y = y; y += s.height; }
    fr.resize(390, y); const hi = fr.children.find(c => c.name === 'iOS · Home indicator'); if (hi) hi.y = fr.height - 34;
    log.push(fr.name + ' → ' + fr.height);
  }
  return log.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 400));
