/**
 * Sections of an event page (/podii/:slug, Figma «Події · нова структура»):
 * the arch first screen, three moments, the games picked for the event, the four
 * packages, real photos, the event's own questions and the request form.
 */
import Icon from './Icon.jsx';
import BookingForm from './BookingForm.jsx';
import { Button, Heading, Media, SectionHead } from './ui.jsx';
import { GameCard } from './sections.jsx';
import { findGame, rental } from '../data/games.js';
import { href } from '../router.js';

/** «850 грн» */
const uah = (n) => `${n} грн`;

const rv = (delay) => ({ className: 'rv', 'data-reveal': '90', style: delay ? { '--rv-delay': delay } : undefined });

/* ----------------------------------------------------------------- First screen */

const artCards = [
  { icon: 'truck', title: 'Доставка й встановлення', note: 'Львів та область' },
  { icon: 'whistle', title: 'Інструктор на вечір', note: `${rental.instructorRate} грн/год, від ${rental.instructorHours} годин` },
];

/**
 * Left: crumbs, two-tone title, lead and one button. Right: an arch photo of the event on a
 * pale circle, two round game photos, a price tag and two small cards — one box that scales
 * with its width (every size is a multiple of --u, see .event-art in pages.css).
 */
export function EventHero({ page }) {
  const roundGame = findGame(page.picks[2].game);
  const squareGame = findGame(page.picks[1].game);
  return (
    <section className="event-hero">
      <div className="container event-hero__grid">
        <div className="event-hero__copy">
          <nav className="event-crumbs rv" data-reveal="95" aria-label="Шлях">
            <a href={href('/podii')}>Події</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.name}</span>
          </nav>
          <Heading as="h1" title="Дерев’яні ігри на" accent={page.acc} reveal className="event-hero__title" />
          <p {...rv('0.3s')} className="event-hero__lead rv">
            {page.lead}
          </p>
          <div {...rv('0.4s')} className="event-hero__actions rv">
            <Button href="#games">Переглянути ігри</Button>
          </div>
        </div>

        <div className="event-art rv" data-reveal="95" style={{ '--rv-delay': '0.2s' }}>
          <span className="event-art__circle" aria-hidden="true" />
          <span className="event-art__arch">
            <Media photo={`podii-${page.slug}-hero`} eager />
          </span>
          <span className="event-art__round">
            <Media photo={roundGame.photo} alt="" eager />
          </span>
          <span className="event-art__square">
            <Media photo={squareGame.photo} alt="" eager />
          </span>
          {artCards.map((c, i) => (
            <span key={c.icon} className={`event-art__card event-art__card--${i + 1}`}>
              <span className="event-art__tile">
                <Icon name={c.icon} />
              </span>
              <span className="event-art__text">
                <strong>{c.title}</strong>
                <span>{c.note}</span>
              </span>
            </span>
          ))}
          <span className="event-art__tag">від {uah(rental.packages[0].price)} за гру на добу</span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- Moments */

export function EventMoments({ page }) {
  const [title, accent] = page.momentsTitle;
  return (
    <section className="section section--cream event-moments">
      <div className="container">
        <SectionHead title={title.trim()} accent={accent} />
        <ul className="event-moments__list" role="list">
          {page.moments.map((m, i) => (
            <li key={m.title} {...rv(`${0.2 + i * 0.08}s`)} className="rv event-moment">
              <span className="event-moment__tile">
                <Icon name={m.icon} size={28} />
              </span>
              <h3 className="event-moment__title">{m.title}</h3>
              <p className="event-moment__text">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- Games */

export function EventPicks({ page }) {
  return (
    <section className="section event-picks" id="games">
      <div className="container">
        <SectionHead title="Ігри для" accent={page.gen} />
        <ul className="game-grid" role="list">
          {page.picks.map((p, i) => (
            <li key={p.game} {...rv(`${0.2 + (i % 3) * 0.06}s`)} className="rv">
              <GameCard game={findGame(p.game)} chip={page.type} text={p.reason} />
            </li>
          ))}
        </ul>
        <div className="event-more">
          <Button to="/games" variant="outline" disc={false}>
            Усі ігри в каталозі
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- Packages */

export function EventPackages({ page }) {
  return (
    <section className="section section--cream event-packages">
      <div className="container">
        <SectionHead title="Комплект і" accent="вартість" />
        <ul className="package-cards" role="list">
          {rental.packages.map((p, i) => (
            <li key={p.count} {...rv(`${0.2 + i * 0.06}s`)} className="rv package-card">
              <div className="package-card__top">
                <span className="package-card__name">{p.label}</span>
                {p.save ? <span className="package-card__save">−{uah(p.save)}</span> : null}
              </div>
              <p className="package-card__price">{uah(p.price)}</p>
              <p className="package-card__per">за добу</p>
              <div className="package-card__kit">
                <span className="package-card__faces" aria-hidden="true">
                  {page.kits[i].map((slug) => (
                    <span key={slug} className="package-card__face">
                      <Media photo={findGame(slug).photo} alt="" />
                    </span>
                  ))}
                </span>
                <p>{page.kits[i].map((slug) => findGame(slug).name).join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="event-more">
          <Button to="/games" variant="outline" disc={false}>
            А інші ігри — в каталозі
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- Gallery */

export function EventGallery({ page }) {
  return (
    <section className="section event-gallery">
      <div className="container">
        <SectionHead title="Як це виглядає" accent={page.photosFor} />
        <ul className="event-gallery__grid" role="list">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} {...rv(`${0.2 + (n - 1) * 0.06}s`)} className="rv">
              <Media photo={`podii-${page.slug}-${n}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------- FAQ */

export function EventFaq({ page }) {
  return (
    <section className="section section--cream event-faq">
      <div className="container">
        <SectionHead title="Питання про" accent={page.acc} />
        <ul className="event-faq__list" role="list">
          {page.faq.map((f, i) => (
            <li key={f.q} {...rv(`${0.15 + i * 0.05}s`)} className="rv">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ Request */

const promises = ['Склад і суму узгоджуємо до оплати', 'Доставка й встановлення в один день', 'Тип події вже вказано у формі'];

export function EventRequest({ page }) {
  const [title, accent] = page.request;
  return (
    <section className="section event-request" id="request">
      <div className="container">
        <div className="event-request__box">
          <div className="event-request__copy">
            <p className="event-request__chip">Тип події: {page.name}</p>
            <Heading as="h2" title={title.trim()} accent={accent} className="event-request__title" />
            <p className="event-request__text">Залиште заявку — порахуємо суму, підберемо ігри під локацію й зв’яжемося протягом доби. Без передоплати.</p>
            <ul className="event-request__points" role="list">
              {promises.map((t) => (
                <li key={t}>
                  <Icon name="check" size={18} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="event-request__form">
            <BookingForm variant="page" event={page.name} head={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
