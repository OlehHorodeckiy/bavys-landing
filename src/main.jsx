import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/theme-olive.css';
import './styles/mobile.css';
import App from './App.jsx';
import { initAnalytics } from './analytics.js';
import { interceptLinks } from './router.js';

initAnalytics();

// dev-only palette study: /…?palette=olive switches the moodboard colours on (styles/theme-olive.css)
if (import.meta.env.DEV) {
  const syncPalette = () => {
    const palette = new URLSearchParams(window.location.search).get('palette');
    if (palette) document.documentElement.dataset.palette = palette;
    else delete document.documentElement.dataset.palette;
  };
  syncPalette();
  window.addEventListener('popstate', syncPalette);
  window.addEventListener('bavys:navigate', syncPalette);
}

const ready = interceptLinks();

// the build ships every page as ready HTML (scripts/prerender.mjs): take it over; the dev server starts empty
const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (!ready) {
  // redirecting an old «#/…» link to its page
} else if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
