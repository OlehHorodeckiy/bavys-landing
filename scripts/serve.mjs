// Serve dist/ the way Cloudflare Pages does: /games → games.html, /games/x → games/x.html,
// unknown paths → 404.html with status 404. `npm run preview` (after `npm run build`).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const file = (p) => fs.existsSync(p) && fs.statSync(p).isFile() && p;

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
    const base = path.join(dist, pathname);
    if (!base.startsWith(dist)) return res.writeHead(403).end();
    const hit = file(base) || file(`${base}.html`) || file(path.join(base, 'index.html'));
    const target = hit || path.join(dist, '404.html');
    res.writeHead(hit ? 200 : 404, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    fs.createReadStream(target).pipe(res);
  })
  .listen(port, '127.0.0.1', () => console.log(`dist on http://127.0.0.1:${port}`));
