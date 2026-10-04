const code = `
  const site = figma.root.children.find(p => p.name === 'Сайт');
  await site.loadAsync();
  const moved = [];
  for (const mark of ['page-game', 'page-article', 'page-404']) {
    const f = figma.currentPage.children.find(n => n.getPluginData('bavys-import') === mark);
    if (!f) continue;
    const old = site.children.find(n => n.getPluginData('bavys-import') === mark);
    if (old) old.remove();
    const x = f.x, y = f.y; site.appendChild(f); f.x = x; f.y = y; moved.push(f.name);
  }
  await figma.setCurrentPageAsync(site);
  return figma.currentPage.name + ': ' + moved.join(', ');
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? j.result ?? JSON.stringify(j));
