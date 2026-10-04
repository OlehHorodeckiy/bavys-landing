/**
 * Google Analytics 4, production build only.
 *
 * The measurement ID comes from VITE_GA_ID (.env.production). Without it every
 * call here is a no-op, so the site works the same before GA is set up.
 *
 * The site uses a hash router, so page views are sent by hand on every route
 * change (App.jsx) with a clean path instead of «#/…»:
 *   …/bavys-landing/#/games/velyka-dzhenga → page_location …/bavys-landing/games/velyka-dzhenga
 * In the GA web stream, turn off «Page changes based on browser history events»
 * so these views are not counted twice.
 *
 * Events: booking_open (popup), generate_lead (request sent; mark it as a key
 * event in GA), click_phone, click_email, click_instagram.
 */
const ID = import.meta.env.VITE_GA_ID;
const ON = Boolean(import.meta.env.PROD && ID);

export function initAnalytics() {
  if (!ON) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', ID, { send_page_view: false });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);

  // contact clicks anywhere on the site
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const h = a.getAttribute('href');
    if (h.startsWith('tel:')) track('click_phone');
    else if (h.startsWith('mailto:')) track('click_email');
    else if (h.includes('instagram.com')) track('click_instagram');
  });
}

export function track(name, params = {}) {
  if (ON && window.gtag) window.gtag('event', name, params);
}

export function trackPage(path, title) {
  if (!ON) return;
  const base = window.location.origin + window.location.pathname.replace(/\/$/, '');
  track('page_view', { page_location: base + (path === '/' ? '/' : path), page_title: title });
}
