import Icon from '../components/Icon.jsx';
import { Media } from '../components/ui.jsx';
import { CtaBanner, PageTitle, StepsTiles, occasionType } from '../components/sections.jsx';
import { games } from '../data/games.js';
import { eventPhotos, useCases } from '../data/site.js';
import { href } from '../router.js';

// real facts only: the catalog size and the shared rental terms
const facts = [
  { icon: 'check', text: `${games.length} ігор у каталозі` },
  { icon: 'truck', text: 'Доставка по Львову та області' },
  { icon: 'wallet', text: 'Без передоплати' },
];

/**
 * «Події» (Figma «13 Події»): the title with three facts, six event cards in
 * a 3×2 grid (photo, name with an arrow, one line about it), how to order and
 * the booking banner. Until each event has its own page, a card opens the
 * catalog filtered by that event.
 */
export default function Events() {
  return (
    <>
      <PageTitle label="Події" title="Ігри для" accent="будь-якої події" text="Оберіть свято, і ми покажемо ігри, які на ньому працюють найкраще.">
        <ul className="events-facts rv" data-reveal="90" style={{ '--rv-delay': '0.4s' }} role="list">
          {facts.map((f) => (
            <li key={f.text}>
              <Icon name={f.icon} size={20} />
              {f.text}
            </li>
          ))}
        </ul>
      </PageTitle>

      <section className="section events-hub">
        <div className="container">
          <ul className="event-cards" role="list">
            {useCases.map((u, i) => (
              <li key={u.id} className="rv" data-reveal="90" style={{ '--rv-delay': `${0.2 + (i % 3) * 0.06}s` }}>
                <a className="event-card" href={href('/games', { type: occasionType(u.id) })}>
                  <span className="event-card__media">
                    <Media photo={eventPhotos[u.id]?.photo || u.photo} position={eventPhotos[u.id]?.position} alt="" />
                  </span>
                  <span className="event-card__head">
                    <h2 className="event-card__title">{u.title}</h2>
                    <span className="event-card__arrow" aria-hidden="true">
                      <Icon name="arrowUpRight" size={18} />
                    </span>
                  </span>
                  <span className="event-card__note">{u.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StepsTiles tone="cream" />
      <CtaBanner tone="cream" />
    </>
  );
}
