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
    document.body.classList.add('modal-open');
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
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
      back.current?.focus?.();
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
