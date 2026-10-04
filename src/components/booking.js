/**
 * Opening the booking popup from anywhere: every «Забронювати» / «Замовити ігри»
 * button calls openBooking(); <BookingModal> (mounted once in App) listens.
 * `game` (a slug) is quietly added to the request when booked from a game page.
 */
const EVENT = 'bavys:book';

export const openBooking = (game) => window.dispatchEvent(new CustomEvent(EVENT, { detail: { game } }));

export const onBooking = (fn) => {
  const handler = (e) => fn(e.detail || {});
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};
