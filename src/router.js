import { useEffect, useState } from 'react';

/**
 * Minimal hash router: `#/games/velyka-dzhenga?x=1` → { path: '/games/velyka-dzhenga', segments, query }.
 * Hash routing keeps every page reachable on any static host (no rewrite rules needed).
 */
function parse() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const segments = path.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  return { path, segments, query };
}

export function useRoute() {
  const [route, setRoute] = useState(parse);

  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export const href = (path, query) => {
  const qs = query ? `?${new URLSearchParams(query).toString()}` : '';
  return `#${path}${qs}`;
};

export const navigate = (path, query) => {
  window.location.hash = href(path, query).slice(1);
};
