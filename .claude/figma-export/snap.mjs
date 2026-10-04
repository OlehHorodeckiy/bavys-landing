const [id, out] = process.argv.slice(2);
const code = `const n = await figma.getNodeByIdAsync(${JSON.stringify(id)}); return figma.base64Encode(await n.exportAsync({ format: 'JPG', constraint: { type: 'SCALE', value: 1 } }));`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
(await import('fs')).writeFileSync(out, Buffer.from(j.value, 'base64'));
console.log('ok', out);
