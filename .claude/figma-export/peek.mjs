const id = process.argv[2], depth = +(process.argv[3] || 3);
const code = `
  const n0 = await figma.getNodeByIdAsync(${JSON.stringify(id)});
  const out = [];
  const walk = (n, d) => {
    const r = n.absoluteBoundingBox || {};
    let extra = '';
    if (n.type === 'TEXT') extra = ' «' + n.characters.slice(0, 80).replace(/\\n/g, '⏎') + '» ' + (n.fontName.family||'mixed') + ' ' + (n.fontName.style||'') + ' ' + String(n.fontSize) + ' lh ' + JSON.stringify(n.lineHeight);
    if ('fills' in n && Array.isArray(n.fills) && n.fills[0]) extra += ' fill ' + n.fills[0].type + (n.fills[0].color ? ' ' + ['r','g','b'].map(k => Math.round(n.fills[0].color[k]*255).toString(16).padStart(2,'0')).join('') : '');
    if (n.layoutMode && n.layoutMode !== 'NONE') extra += ' AL ' + n.layoutMode + ' gap ' + n.itemSpacing + ' pad ' + [n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft].join('/');
    if (n.cornerRadius) extra += ' r ' + String(n.cornerRadius);
    out.push('  '.repeat(d) + n.id + ' ' + n.type + ' "' + n.name + '" ' + Math.round(n.x) + ',' + Math.round(n.y) + ' ' + Math.round(n.width) + 'x' + Math.round(n.height) + extra);
    if (d < ${depth} && 'children' in n) for (const c of n.children) walk(c, d + 1);
  };
  walk(n0, 0);
  return out.join('\\n');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
