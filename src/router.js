import { useEffect, useState } from 'react';

/**
 * Clean-URL router: `/games/velyka-dzhenga?game=x` → { path: '/games/velyka-dzhenga', segments, query }.
 *
 * Every page is also prerendered to its own HTML file at build time
 * (scripts/prerender.mjs), so search engines see each page with its text and
 * meta tags. In the browser, internal links switch pages without a reload
 * (history API, see interceptLinks); old «#/…» links are rewritten on load.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' when the site sits at the domain root
const EVENT = 'bavys:navigate';

let serverUrl = '/';
/** Prerender: which URL renderToString is drawing. */
export const setServerUrl = (url) => {
  serverUrl = url;
};

export function parseUrl(url) {
  const u = new URL(url, 'http://local');
  let path = u.pathname;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || '/';
  path = path.replace(/\/index\.html$/, '/');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(u.searchParams);
  return { path, segments, query };
}

const current = () =>
  typeof window === 'undefined' ? parseUrl(serverUrl) : parseUrl(window.location.pathname + window.location.search);

export function useRoute() {
  // the prerendered HTML was drawn without ?query, so the first render matches it;
  // the real query (e.g. /games?type=wedding) is applied right after
  const [route, setRoute] = useState(() => ({ ...current(), query: {} }));

  useEffect(() => {
    const onChange = () => setRoute(current());
    if (window.location.search) onChange();
    window.addEventListener('popstate', onChange);
    window.addEventListener(EVENT, onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener(EVENT, onChange);
    };
  }, []);

  return route;
}

export const href = (path, query) => {
  const qs = query ? `?${new URLSearchParams(query).toString()}` : '';
  return `${BASE}${path}${qs}`;
};

const go = (to, replace = false) => {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
  window.dispatchEvent(new Event(EVENT));
  window.scrollTo(0, 0);
};

export const navigate = (path, query) => go(href(path, query));

/**
 * Once, in the browser: send legacy «#/…» addresses to their real page (returns
 * false while that redirect is under way) and let every internal
 * <a href> change the page without a reload (new tab, downloads, other sites
 * and in-page «#anchor» links keep the browser's own behaviour).
 */
export function interceptLinks() {
  // an old link like /#/games/kornkhol: load the real page (its own prerendered HTML)
  if (window.location.hash.startsWith('#/')) {
    window.location.replace(BASE + window.location.hash.slice(1));
    return false;
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash.startsWith('#/')) go(BASE + window.location.hash.slice(1), true);
  });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest?.('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href);
    if (url.origin !== window.location.origin || (BASE && !url.pathname.startsWith(BASE))) return;
    if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // a file, not a page
    const same = url.pathname === window.location.pathname && url.search === window.location.search;
    if (same && url.hash) return; // anchor on this page
    e.preventDefault();
    if (same) window.scrollTo(0, 0);
    else go(url.pathname + url.search + url.hash);
  });
  return true;
}
