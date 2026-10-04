import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/theme-olive.css';
import './styles/mobile.css';
import App from './App.jsx';
import { initAnalytics } from './analytics.js';

initAnalytics();

// dev-only palette study: #/…?palette=olive switches the moodboard colours on (styles/theme-olive.css)
if (import.meta.env.DEV) {
  const syncPalette = () => {
    const palette = new URLSearchParams(window.location.hash.split('?')[1] || '').get('palette');
    if (palette) document.documentElement.dataset.palette = palette;
    else delete document.documentElement.dataset.palette;
  };
  syncPalette();
  window.addEventListener('hashchange', syncPalette);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
