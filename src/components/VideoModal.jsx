import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';

/**
 * Full video over a dimmed page (Figma «Про нас: відео відкрите»): the video
 * plays from the start with sound and its own controls; the cross, Esc and a
 * click on the backdrop close it. The page underneath is pinned like under the
 * booking popup, and focus goes back to the button that opened it. Rendered
 * into <body> so no section's stacking context keeps the header above it.
 */
export default function VideoModal({ src, poster, label, onClose }) {
  const close = useRef(null);

  useEffect(() => {
    const back = document.activeElement;
    const y = window.scrollY;
    const { body } = document;
    body.classList.add('modal-open');
    body.style.top = `-${y}px`;
    close.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // the dialog has two stops: the video controls and the cross
        const f = [...document.querySelectorAll('.video-modal video, .video-modal__close')];
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.classList.remove('modal-open');
      body.style.top = '';
      window.scrollTo(0, y);
      back?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="video-modal" role="dialog" aria-modal="true" aria-label={label} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="video-modal__frame">
        <video src={src} poster={poster} controls autoPlay playsInline preload="auto" />
        <button type="button" className="video-modal__close" aria-label="Закрити відео" onClick={onClose} ref={close}>
          <Icon name="close" size={20} strokeWidth={2} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
