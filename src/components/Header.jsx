import { useEffect, useState } from 'react';
import { nav, company } from '../data/site.js';
import { href } from '../router.js';
import Icon from './Icon.jsx';
import { Button, Logo } from './ui.jsx';

const isHere = (current, path) => (path === '/' ? current === '/' : current.startsWith(path));

/**
 * Floating header over each page's light first screen: logo, plain text links
 * (the current page gets the accent pill) and a brown «Забронювати» that opens
 * the booking popup. Below 1080px the links move into a full-screen panel.
 */
export default function Header({ path, book }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [path]);

  // pinned from 768px up: transparent over the first screen, white once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header site-header--light ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__bar container">
        <a className="site-header__logo" href={href('/')} aria-label="Бавись — на головну">
          <Logo />
        </a>

        <nav className="site-nav" aria-label="Головна навігація">
          {nav.map((item) => (
            <a
              key={item.path}
              className={`site-nav__link ${isHere(path, item.path) ? 'is-current' : ''}`}
              href={href(item.path)}
              aria-current={isHere(path, item.path) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <Button book={book} variant="nav" className="site-header__cta">
            Забронювати
          </Button>
          <button
            type="button"
            className="menu-btn"
            aria-label="Відкрити меню"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Меню">
        <div className="mobile-menu__top">
          <a href={href('/')} aria-label="Бавись — на головну" tabIndex={open ? 0 : -1}>
            <Logo />
          </a>
          <button type="button" className="menu-btn menu-btn--close" aria-label="Закрити меню" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav className="mobile-menu__links" aria-label="Мобільна навігація">
          {nav.map((item) => (
            <a
              key={item.path}
              href={href(item.path)}
              className={isHere(path, item.path) ? 'is-current' : ''}
              aria-current={isHere(path, item.path) ? 'page' : undefined}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu__foot">
          <Button book={book} variant="light" full tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            Надіслати заявку
          </Button>
          <a className="mobile-menu__phone" href={company.phoneHref} tabIndex={open ? 0 : -1}>
            <Icon name="phone" size={18} /> {company.phone}
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * Phone-only pinned actions: «Забронювати» across the screen + an Instagram circle
 * (Figma «13 Стартовий екран + Instagram»). None on contacts: the form and the
 * phone are right there (Figma «09 Контакти — 390»).
 */
export function MobileBar({ path, book }) {
  if (path.startsWith('/contacts')) return null;
  const instagram = company.socials.find((s) => s.id === 'instagram');
  return (
    <div className="mobile-bar mobile-bar--book" role="navigation" aria-label="Швидкі дії">
      <Button book={book} variant="primary">
        Забронювати
      </Button>
      <a className="mobile-bar__ig" href={instagram.href} target="_blank" rel="noreferrer" aria-label="Instagram">
        <Icon name="instagram" size={20} />
      </a>
    </div>
  );
}
