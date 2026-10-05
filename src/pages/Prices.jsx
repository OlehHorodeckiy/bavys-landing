import { findGame, rental } from '../data/games.js';
import { href } from '../router.js';
import { Button, Heading, Media, Pill } from '../components/ui.jsx';
import { CtaBanner, FaqSection } from '../components/sections.jsx';

/** «850 грн», with a no-break space so the number keeps its word. */
const uah = (n) => `${n} грн`;
const day = (s) => s.replace(' / доба', '').replace(' ', ' ');

// own-price games and the table, in the Figma order; the notes are the facts the site already states
const special = [
  { slug: 'velyka-dzhenga', photo: 'prices-jenga', note: 'Якщо свято на плитці чи асфальті, м’яку підкладку даємо безкоштовно.' },
  { slug: 'birponh', photo: 'prices-birponh', kit: true },
  { slug: 'velykyi-morskyi-bii', photo: 'prices-morskyi-bii' },
].map(({ slug, photo, note, kit }) => {
  const g = findGame(slug);
  return { key: slug, name: g.name, price: day(g.price), per: 'за добу', photo, note: note || g.short, kit, href: `/games/${slug}` };
});
special.push({ key: 'table', name: 'Стіл для ігор', price: rental.table.replace(' ', ' '), per: 'за 1 стіл', photo: 'prices-table', note: 'Дерев’яний розкладний стіл під настільні ігри.' });

const kit = [
  ['#d64545', '12 червоних стаканчиків'],
  ['#3f6fd1', '12 синіх стаканчиків'],
  ['#ffffff', '6 м’ячиків'],
];

const points = ['Швидко й зрозуміло пояснює правила', 'За потреби грає разом із гостями', 'Робить відпочинок гостей цікавішим та активнішим'];

/**
 * Prices (Figma «12 Ціни — 1440 / 390»): the price list next to a photo, the
 * own-price games as cards 2 × 2 under it, the instructor with the Bavys T-shirt,
 * then the FAQ and the booking banner. All numbers come from data/games.js.
 */
export default function Prices() {
  return (
    <>
      <section className="prices-hero">
        <div className="container">
          <div className="prices-hero__split">
            <div className="prices-hero__photo">
              <Media photo="ev-jenga-festival" position="50% 40%" eager />
            </div>
            <div className="prices-hero__main">
              <div className="prices-hero__head">
                <Pill tone="cream">Ціни</Pill>
                <Heading as="h1" title="Скільки коштує" accent="оренда ігор" br className="prices-hero__title" />
                <p className="prices-hero__text">Що більше ігор берете, то вигідніше кожна. Велика Дженга, Бірпонг і Морський бій мають свою ціну.</p>
              </div>
              <ul className="price-list" role="list">
                {rental.packages.map((p) => (
                  <li key={p.count} className="price-list__row">
                    <span className="price-list__name">
                      {p.label}
                      {p.save ? <span className="price-list__save">−{uah(p.save)}</span> : null}
                    </span>
                    <strong>{uah(p.price)}</strong>
                  </li>
                ))}
                <li className="price-list__row">
                  <span className="price-list__name">Кожна наступна гра</span>
                  <strong>+{uah(rental.next)}</strong>
                </li>
              </ul>
            </div>
          </div>

          <ul className="special-cards" role="list" aria-label="Ігри й столи з окремою ціною">
            {special.map((s) => (
              <li key={s.key} className="special-card">
                <div className="special-card__media">
                  <Media photo={s.photo} />
                  <span className="special-card__tag">
                    <strong>{s.price}</strong> {s.per}
                  </span>
                </div>
                <div className="special-card__body">
                  <h2 className="special-card__name">{s.href ? <a href={href(s.href)}>{s.name}</a> : s.name}</h2>
                  <p>{s.note}</p>
                  {s.kit ? (
                    <div className="special-card__kit">
                      <p className="special-card__kit-head">
                        <span>Комплект для гри</span>
                        <strong>+{uah(500)}</strong>
                      </p>
                      <ul role="list">
                        {kit.map(([dot, t]) => (
                          <li key={t}>
                            <span className="special-card__dot" style={{ background: dot }} />
                            {t}
                          </li>
                        ))}
                      </ul>
                      <p className="special-card__kit-note">Можна взяти свої або замовити в нас.</p>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--cream prices-instructor">
        <div className="container">
          <div className="instructor-card">
            <div className="instructor-card__text">
              <Heading as="h2" title="Інструктор" accent="на святі" br className="instructor-card__title" />
              <div className="instructor-card__body">
                <p>Базово до кожної гри додаємо правила. Інструктор поруч, щоб гості не розбиралися самі.</p>
                <ul className="instructor-card__points" role="list">
                  {points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="instructor-card__cta">
                <div className="instructor-card__price">
                  <p>
                    <strong>{uah(rental.instructorRate)}</strong>
                    <span>за годину</span>
                  </p>
                  <p>
                    <strong>від {rental.instructorHours} годин</strong>
                    <span>від {uah(rental.instructorRate * rental.instructorHours)} за свято</span>
                  </p>
                </div>
                <Button book>Замовити інструктора</Button>
              </div>
            </div>
            <div className="instructor-card__tee">
              <Media photo="prices-tee" />
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      <CtaBanner tone="white" />
    </>
  );
}
