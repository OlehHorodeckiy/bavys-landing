// Mobile Figma frame vs the local site at 390: match every text by its words, print the y drift.
// args: figmaFrameId route [fromY] [toY]
// A jump in Δ between two neighbours = a spacing (or size) that differs between Figma and code.
import { spawn } from 'child_process';
const [frameId, route, fromY = 0, toY = 1e9] = process.argv.slice(2);
const SB = 62; // the iPhone status bar on top of every Figma frame

const fcode = `
  const fr = await figma.getNodeByIdAsync(${JSON.stringify(frameId)});
  const ox = fr.absoluteTransform[0][2], oy = fr.absoluteTransform[1][2];
  return JSON.stringify(fr.findAll(n => n.type === 'TEXT' && n.visible && !n.name.startsWith('iOS')).filter(t => { let p = t; while (p && p !== fr) { if (p.visible === false || /^iOS/.test(p.name) || p.name === 'site-header') return false; p = p.parent; } return true; })
    .map(t => ({ s: t.characters, x: Math.round(t.absoluteTransform[0][2] - ox), y: Math.round(t.absoluteTransform[1][2] - oy) - ${SB}, w: Math.round(t.width), h: Math.round(t.height), fs: typeof t.fontSize === 'number' ? t.fontSize : 'mix', lh: t.lineHeight && t.lineHeight.value ? t.lineHeight.value : 'mix' })));
`;
const fj = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: fcode, timeout: 120 }) })).json();
const fig = JSON.parse(fj.value);

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9352', '--user-data-dir=' + new URL('./hprof3', import.meta.url).pathname, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tgt; for (let i = 0; i < 50; i++) { try { tgt = (await (await fetch('http://127.0.0.1:9352/json/list')).json()).find((t) => t.type === 'page'); if (tgt) break; } catch {} await sleep(200); }
const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.navigate', { url: 'http://127.0.0.1:5174/?x=' + Date.now() + '#' + route });
await sleep(2500);
const expr = `(() => {
  const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'; document.head.appendChild(st);
  document.querySelectorAll('.rv,.reveal-chars,[data-reveal]').forEach(e => e.classList.add('is-in'));
  const out = [];
  const walk = (el) => {
    if (el.closest('.site-header, [aria-hidden="true"]') && !el.closest('.hero-strip')) return;
    const whole = /^(H[1-6]|P|DT|DD|LABEL|FIGCAPTION|BLOCKQUOTE)$/.test(el.tagName) || el.classList.contains('pill') || el.classList.contains('chip');
    const own = whole ? (el.innerText || '').trim() : [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const cs = getComputedStyle(el);
    if (own && cs.display !== 'none' && cs.visibility !== 'hidden') {
      const r = el.getBoundingClientRect();
      if (r.height) out.push({ s: el.innerText || el.textContent, x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) || cs.lineHeight });
      return;
    }
    for (const c of el.children) walk(c);
  };
  walk(document.querySelector('#root'));
  return JSON.stringify(out);
})()`;
const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
const code = JSON.parse(r.result.result.value);
ws.close(); proc.kill();

const norm = (s) => s.toLowerCase().replace(/[^a-zа-яіїєґ0-9]/g, '');
const used = new Set();
let last = null;
const rows = [];
for (const f of fig.sort((a, b) => a.y - b.y || a.x - b.x)) {
  if (f.y < +fromY || f.y > +toY) continue;
  const nf = norm(f.s); if (nf.length < 2) continue;
  let best = null;
  code.forEach((c, i) => {
    if (used.has(i)) return;
    const nc = norm(c.s); if (nc.length < 2) return;
    const ok = nf === nc || (Math.min(nf.length, nc.length) >= 6 && (nf.startsWith(nc) || nc.startsWith(nf)));
    if (!ok) return;
    const d = Math.abs(c.y - f.y - (last ?? 0));
    if (d > 600) return;
    if (!best || d < best.d) best = { i, c, d };
  });
  if (!best) { rows.push(`  ${String(f.y).padStart(5)}   ——   no match        «${f.s.slice(0, 40).replace(/\n/g, ' ')}»`); continue; }
  used.add(best.i);
  const c = best.c, dy = c.y - f.y, jump = last === null ? '' : dy - last;
  const sz = (f.fs !== c.fs || (f.lh !== 'mix' && Math.abs(f.lh - c.lh) > 0.5) || Math.abs(f.h - c.h) > 2) ? `  fig ${f.fs}/${f.lh} h${f.h} x${f.x} w${f.w} · code ${c.fs}/${c.lh} h${c.h} x${c.x} w${c.w}` : (Math.abs(f.x - c.x) > 2 ? `  x fig ${f.x} code ${c.x}` : '');
  rows.push(`${jump !== '' && jump !== 0 ? '!' : ' '} ${String(f.y).padStart(5)} ${String(c.y).padStart(5)} Δ${String(dy).padStart(5)} ${jump !== '' && jump !== 0 ? '(' + (jump > 0 ? '+' : '') + jump + ')' : '     '} «${f.s.slice(0, 34).replace(/\n/g, ' ')}»${sz}`);
  last = dy;
}
console.log(rows.join('\n'));
