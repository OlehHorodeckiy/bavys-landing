// Full-page screenshots of local routes at 1440 (reveals forced to their final state).
import fs from 'fs';
import { spawn } from 'child_process';
const routes = process.argv[2].split(',');
const OUT = process.argv[3];
const W = +(process.argv[4] || 1440);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9351', '--user-data-dir=' + new URL('./hprof2', import.meta.url).pathname, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tgt; for (let i = 0; i < 50; i++) { try { tgt = (await (await fetch('http://127.0.0.1:9351/json/list')).json()).find((t) => t.type === 'page'); if (tgt) break; } catch {} await sleep(200); }
const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 768 });
for (const route of routes) {
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/?x=' + Date.now() + '#' + route });
  await sleep(2500);
  await send('Runtime.evaluate', { expression: `document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')); document.querySelectorAll('.rv,.reveal-chars').forEach(e=>e.classList.add('is-in')); document.documentElement.style.setProperty('--fan','1'); document.querySelectorAll('img').forEach(i=>i.loading='eager'); window.scrollTo(0, document.body.scrollHeight); 1` });
  await sleep(1500);
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0); 1' });
  await sleep(600);
  const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: h, deviceScaleFactor: 1, mobile: W < 768 });
  await sleep(800);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
  const name = (route.replace(/[\/?=]/g, '_') || '_home').replace(/^_$/, '_home');
  fs.writeFileSync(`${OUT}/shot${name}.jpg`, Buffer.from(shot.result.data, 'base64'));
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 768 });
  console.log(route, h);
}
ws.close(); proc.kill();
