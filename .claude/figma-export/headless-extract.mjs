// Run extract.js on the local site in headless Chrome (no browser pane needed).
// args: route dumpname [width=1440] [pre-js run before extracting]
import { spawn } from 'child_process';
const route = process.argv[2] || '/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9350', '--user-data-dir=' + new URL('./hprof', import.meta.url).pathname, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tgt; for (let i = 0; i < 50; i++) { try { tgt = (await (await fetch('http://127.0.0.1:9350/json/list')).json()).find((t) => t.type === 'page'); if (tgt) break; } catch {} await sleep(200); }
const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result;
await send('Page.enable');
const W = +(process.argv[4] || 1440);
const VH = +(process.argv[6] || (W < 768 ? 844 : 900));
await send('Emulation.setDeviceMetricsOverride', { width: W, height: VH, deviceScaleFactor: 1, mobile: W < 768 });
await send('Page.navigate', { url: 'http://127.0.0.1:5174/?x=' + Date.now() + '#' + route });
await sleep(3000);
await ev(`document.querySelectorAll('img').forEach(i => i.loading = 'eager')`);
if (process.argv[5]) { await ev(process.argv[5]); }
await sleep(1500);
const r = await ev(`import('http://127.0.0.1:8799/extract.js?v=' + Date.now()).then(m => m.run('http://127.0.0.1:8799/${process.argv[3] || 'dump'}'))`);
console.log(JSON.stringify(r.value || r));
ws.close(); proc.kill();
