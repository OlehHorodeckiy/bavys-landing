import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import BookingForm from './BookingForm.jsx';
import { onBooking } from './booking.js';
import { track } from '../analytics.js';

/**
 * The booking popup: a 640px card over a dimmed, blurred page. Opens from every
 * booking button (see booking.js); Esc, the cross and a click on the backdrop
 * close it; focus returns to the button that opened it.
 */
export default function BookingModal() {
  const [state, setState] = useState(null); // { game } while open
  const back = useRef(null);
  const card = useRef(null);

  useEffect(
    () =>
      onBooking(({ game }) => {
        back.current = document.activeElement;
        setState({ game, key: Date.now() });
        track('booking_open', { game: game || '' });
      }),
    [],
  );

  const close = () => setState(null);

  useEffect(() => {
    if (!state) return undefined;
    // iOS Safari ignores overflow:hidden on body: pin the page in place instead,
    // so it does not scroll under the sheet and the toolbar does not move it
    const y = window.scrollY;
    const { body } = document;
    body.classList.add('modal-open');
    body.style.top = `-${y}px`;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !card.current) return;
      const f = card.current.querySelectorAll('button, a[href], input, textarea, select');
      if (!f.length) return;
      const [a, z] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      body.classList.remove('modal-open');
      body.style.top = '';
      window.scrollTo(0, y);
      document.removeEventListener('keydown', onKey);
      back.current?.focus?.({ preventScroll: true });
    };
  }, [state]);

  if (!state) return null;
  return (
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal__card" ref={card} role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button type="button" className="modal__close" aria-label="Закрити" onClick={close}>
          <Icon name="close" size={18} />
        </button>
        <BookingForm key={state.key} variant="modal" game={state.game} onDone={close} />
      </div>
    </div>
  );
}
