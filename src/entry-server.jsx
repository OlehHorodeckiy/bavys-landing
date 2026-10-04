/**
 * Build-time renderer (scripts/prerender.mjs): draws a page to an HTML string so
 * every URL ships with its text already in place for search engines and slow phones.
 */
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { setServerUrl } from './router.js';

export { allRoutes, pageMeta, SITE_URL } from './seo.js';

export function render(url) {
  setServerUrl(url);
  return renderToString(<App />);
}
