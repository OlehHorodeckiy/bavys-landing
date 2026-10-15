/**
 * Pins the page under a popup (iOS Safari ignores overflow:hidden on body, so
 * the body is fixed at the current offset). Counted, so the cart panel and the
 * booking popup can hand over to each other without the page jumping: only the
 * last unlock restores the scroll position.
 */
let count = 0;
let y = 0;

export function lockScroll() {
  if (count++ > 0) return;
  y = window.scrollY;
  document.body.classList.add('modal-open');
  document.body.style.top = `-${y}px`;
}

export function unlockScroll() {
  if (count === 0 || --count > 0) return;
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  window.scrollTo(0, y);
}
