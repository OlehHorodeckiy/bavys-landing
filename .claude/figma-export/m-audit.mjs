// Spacing audit of the mobile frames: per section, top padding (first content y), bottom padding, side margins.
const code = `
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const out = [];
  for (const fr of site.findAll(n => n.type === 'FRAME' && /^m-/.test(n.getPluginData('bavys-import')))) {
    out.push('== ' + fr.name + ' h' + fr.height);
    const secs = [...fr.children].filter(c => !c.getPluginData('iphone') && c.name !== 'site-header').sort((a, b) => a.y - b.y);
    for (const s of secs) {
      if (!('children' in s) || !s.children.length) { out.push('  ' + s.name + ' y' + s.y + ' h' + s.height + ' (empty)'); continue; }
      const kids = s.children.filter(k => k.visible && !/__bg$|^media$/.test(k.name) && !(k.width >= s.width - 1 && k.height >= s.height - 1));
      if (!kids.length) { out.push('  ' + s.name + ' y' + s.y + ' h' + s.height); continue; }
      const top = Math.min(...kids.map(k => k.y)), bot = s.height - Math.max(...kids.map(k => k.y + k.height));
      const left = Math.min(...kids.map(k => k.x)), right = s.width - Math.max(...kids.map(k => k.x + k.width));
      const fill = Array.isArray(s.fills) && s.fills[0] ? (s.fills[0].color ? '#' + ['r','g','b'].map(q => Math.round(s.fills[0].color[q] * 255).toString(16).padStart(2, '0')).join('') : s.fills[0].type) : '-';
      out.push('  ' + s.name.slice(0, 22).padEnd(22) + ' y' + s.y + ' h' + s.height + ' top ' + top + ' bot ' + bot + ' L ' + left + ' R ' + right + ' ' + fill);
    }
  }
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 300));
