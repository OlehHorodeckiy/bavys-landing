import { useEffect, useRef } from 'react';

/**
 * Scroll motion, timed after the Calmlyss reference.
 *
 * - `data-reveal="90"` on an element: it gets `is-in` once its top passes 90%
 *   of the viewport height (85, 80 … work the same). CSS decides the look:
 *   `.rv` rises 60px and fades in, `.reveal-chars` lets letters rise one by one.
 * - `useFanSpread(ref)`: the fan's side cards slide out from behind the middle
 *   one while the fan's top travels from the viewport middle to 30% (scrubbed).
 * - `<CountUp value="120" />`: counts from 0 when it comes into view.
 *
 * With reduced motion everything is shown in its final state straight away.
 */

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Watches every `[data-reveal]` on the page; re-run it when the page changes. */
export function useScrollReveal(pageKey) {
  useEffect(() => {
    const pending = () => [...document.querySelectorAll('[data-reveal]:not(.is-in)')];
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      const showAll = () => pending().forEach((el) => el.classList.add('is-in'));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    const observers = new Map();
    const watched = new WeakSet();
    const watch = (el) => {
      if (watched.has(el)) return;
      watched.add(el);
      const line = Number(el.dataset.reveal) || 90;
      if (!observers.has(line)) {
        observers.set(
          line,
          new IntersectionObserver(
            (entries, obs) => {
              for (const e of entries) {
                // in view, or already scrolled past (landing mid-page)
                if (e.isIntersecting || e.boundingClientRect.top < 0) {
                  e.target.classList.add('is-in');
                  obs.unobserve(e.target);
                }
              }
            },
            { rootMargin: `0px 0px -${100 - line}% 0px` },
          ),
        );
      }
      observers.get(line).observe(el);
    };
    pending().forEach(watch);
    // content rendered after the page (filters, tabs) gets watched as it appears
    const mo = new MutationObserver(() => pending().forEach(watch));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      observers.forEach((o) => o.disconnect());
    };
  }, [pageKey]);
}

/** Drives `--fan` (0 = stacked, 1 = spread) on the fan element from scroll. */
export function useFanSpread(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reducedMotion()) {
      el.style.setProperty('--fan', '1');
      return undefined;
    }
    // top of the fan from 50% to 30% of the viewport, eased like power1.out
    const goal = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, (vh * 0.5 - top) / (vh * 0.2)));
      return 1 - (1 - t) * (1 - t);
    };
    let p = goal();
    let raf = 0;
    let last = 0;
    el.style.setProperty('--fan', p.toFixed(4));
    // scrub: the cards trail the scroll a little (about 0.8s to settle)
    const tick = (now) => {
      const g = goal();
      const dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      p += (g - p) * (1 - Math.exp(-dt / 0.25));
      if (Math.abs(g - p) < 0.0005) p = g;
      el.style.setProperty('--fan', p.toFixed(4));
      raf = p === g ? 0 : requestAnimationFrame(tick);
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, [ref]);
}

/** A number that counts up from 0 (1.2s, power1.out) when it scrolls into view. */
export function CountUp({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const target = Number(value);
    if (!el || Number.isNaN(target) || reducedMotion() || !('IntersectionObserver' in window)) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / 1200);
          el.textContent = String(Math.floor(target * (1 - (1 - t) * (1 - t))));
          if (t < 1) raf = requestAnimationFrame(step);
          else el.textContent = String(target);
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}
