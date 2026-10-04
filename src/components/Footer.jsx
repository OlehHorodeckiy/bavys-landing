import { company, nav } from '../data/site.js';
import { games } from '../data/games.js';
import { href } from '../router.js';
import Icon from './Icon.jsx';
import { Button, IconButton, Logo, Media } from './ui.jsx';
import logoSvg from '../../assets/Group.svg?raw';

/** The big «Бавись» at the bottom: glass letters (frosted fill + light edge) over the photo. */
const GlassWordmark = () => <span className="glass-wordmark" dangerouslySetInnerHTML={{ __html: logoSvg }} />;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" aria-hidden="true">
        <Media photo="footer-garden" alt="" />
      </div>
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo className="logo--light" />
          <p>
            Оренда дерев’яних ігор для весіль, корпоративів, фестивалів і сімейних свят. Привозимо, встановлюємо і
            забираємо — {company.region}.
          </p>
          <div className="site-footer__socials">
            {company.socials.map((s) => (
              <IconButton key={s.id} icon={s.id} label={s.label} href={s.href} variant="square" />
            ))}
          </div>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Навігація</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.path}>
                <a href={href(item.path)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Популярні ігри</h2>
          <ul>
            {games.filter((g) => g.featured).map((g) => (
              <li key={g.slug}>
                <a href={href(`/games/${g.slug}`)}>{g.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__contact">
          <h2 className="site-footer__title">Контакти</h2>
          <a href={company.phoneHref}>
            <Icon name="phone" size={18} /> {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>
            <Icon name="mail" size={18} /> {company.email}
          </a>
          <p>
            <Icon name="pin" size={18} /> {company.region}
          </p>
          <p>
            <Icon name="clock" size={18} /> {company.hours.map((h) => `${h.label} ${h.value}`).join(' · ')}
          </p>
          <Button book variant="light" className="site-footer__cta">
            Надіслати заявку
          </Button>
        </div>
      </div>

      <div className="site-footer__wordmark container" aria-hidden="true">
        <GlassWordmark />
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p>© 2026 Бавись · Оренда дерев’яних ігор у Львові</p>
          <p className="site-footer__bottom-links">
            <a href={href('/games')}>Каталог ігор</a>
            <a href={href('/contacts')}>Бронювання</a>
            <a href={href('/blog')}>Блог</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
