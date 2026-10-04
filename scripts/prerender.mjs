// After `vite build` (browser) and `vite build --ssr` (renderer): write every page as
// ready HTML with its own <head>, plus 404.html, sitemap.xml and robots.txt.
//
// File layout for Cloudflare Pages clean URLs: /games → dist/games.html,
// /games/velyka-dzhenga → dist/games/velyka-dzhenga.html, / → dist/index.html.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const { render, allRoutes, pageMeta, SITE_URL } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.mjs')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = (p) => (SITE_URL ? SITE_URL + p : null);

function head(m) {
  const url = abs(m.path === '/' ? '/' : m.path);
  const image = m.image ? abs(m.image) : null;
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex' : 'index, follow'}" />`,
    url && !m.noindex ? `<link rel="canonical" href="${url}" />` : '',
    '<meta property="og:site_name" content="Бавись" />',
    '<meta property="og:locale" content="uk_UA" />',
    `<meta property="og:type" content="${m.path.startsWith('/blog/') ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : '',
    image ? `<meta property="og:image" content="${image}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(m.jsonLd || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ]
    .filter(Boolean)
    .join('\n    ');
}

function page(route, file) {
  const meta = pageMeta(route);
  const html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
    .replace('</head>', `    ${head(meta)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return meta;
}

const routes = allRoutes();
for (const r of routes) page(r, r === '/' ? 'index.html' : `${r.slice(1)}.html`);
page('/404', '404.html');

if (SITE_URL) {
  const urls = routes.map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${SITE_URL ? `\nSitemap: ${SITE_URL}/sitemap.xml\n` : ''}`);

console.log(`prerendered ${routes.length} pages + 404${SITE_URL ? ` · sitemap for ${SITE_URL}` : ' · no VITE_SITE_URL: canonical, og:image and sitemap skipped'}`);
