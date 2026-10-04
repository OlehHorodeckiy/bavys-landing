import { useState } from 'react';
import { games } from '../data/games.js';
import { steps, useCases } from '../data/site.js';
import { href } from '../router.js';
import Icon from '../components/Icon.jsx';
import { Button, Heading, Media, SectionHead } from '../components/ui.jsx';
import { UseCasesSection } from '../components/sections.jsx';
import '../styles/lab.css';

/**
 * Design lab (dev only, #/lab/usecases): three alternatives for the home
 * "Для яких подій" section, stacked so they can be compared and exported to
 * Figma side by side. Same data as the live section: data/site.js useCases,
 * the real games (data/games.js events) and the occasion photos.
 */

const gamesFor = (id) => games.filter((g) => g.events.includes(id === 'teambuilding' ? 'corporate' : id));
const typeFor = (id) => (id === 'teambuilding' ? 'corporate' : id);

/** 1 гра · 2–4 гри · 5+ ігор */
const gamesWord = (n) => {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return `${n} гра`;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return `${n} гри`;
  return `${n} ігор`;
};

const head = { label: 'Для яких подій', labelTone: 'cream', title: 'Ігри, які доречні', accent: 'на будь-якому святі', br: true };

/* ---------------------------------------------- 1. list + changing photo */
export function UseCasesSplit() {
  const [active, setActive] = useState(useCases[0].id);
  const picks = gamesFor(active);
  return (
    <section className="section uc-split">
      <div className="container uc-split__grid">
        <div className="uc-split__side">
          <SectionHead {...head} align="left" />
          <ol className="uc-split__list">
            {useCases.map((u, i) => (
              <li key={u.id}>
                <button
                  type="button"
                  className={`uc-split__row ${u.id === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(u.id)}
                  onFocus={() => setActive(u.id)}
                  onClick={() => setActive(u.id)}
                >
                  <span className="uc-split__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="uc-split__text">
                    <span className="uc-split__title">{u.title}</span>
                    <span className="uc-split__note">{u.note}</span>
                  </span>
                  <span className="uc-split__count">{gamesWord(gamesFor(u.id).length)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <a className="uc-split__photo" href={href('/games', { type: typeFor(active) })}>
          <Media photo={`occ-${active}`} />
          <span className="uc-split__card">
            <span className="uc-split__card-label">Найчастіше беруть</span>
            <span className="uc-split__card-games">{picks.slice(0, 4).map((g) => g.name).join(' · ')}</span>
            <span className="uc-split__card-go" aria-hidden="true">
              <Icon name="arrowUpRight" size={18} />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- 2. photo tiles */
export function UseCasesTiles() {
  return (
    <section className="section section--cream uc-tiles">
      <div className="container">
        <SectionHead {...head} />
        <ul className="uc-tiles__grid" role="list">
          {useCases.map((u) => (
            <li key={u.id}>
              <a className="uc-tile" href={href('/games', { type: typeFor(u.id) })}>
                <Media photo={`occ-${u.id}`} />
                <span className="uc-tile__shade" aria-hidden="true" />
                <span className="uc-tile__count">{gamesWord(gamesFor(u.id).length)}</span>
                <span className="uc-tile__body">
                  <span className="uc-tile__title">{u.title}</span>
                  <span className="uc-tile__note">{u.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 3. rows with the games — chosen; now the live UseCasesSection */

/* ---------------------------------------- steps: "Як це працює" as cards */
/** tone: 'white' = white cards on the dark section, 'light' = white cards on cream */
export function StepsCards({ items = steps, tone = 'white' }) {
  const dark = tone !== 'light';
  return (
    <section className={`section ${dark ? 'section--dark' : 'section--cream'} steps-cards steps-cards--${tone}`}>
      <div className="container">
        <SectionHead
          label="Як це працює"
          title="Від вибору гри"
          accent="до свята — 4 кроки"
          br
          text="Без передоплати й складних форм. Ви обираєте — ми беремо на себе все інше."
          labelTone={dark ? undefined : 'white'}
          className={dark ? 'section-head--on-dark' : ''}
        />
        <ol className="step-cards" role="list">
          {items.map((s, i) => (
            <li key={s.no} className="step-card rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
              <div className="step-card__top">
                <span className="step-card__no">{s.no}</span>
                <span className="step-card__time">
                  <Icon name="clock" size={14} /> {s.meta}
                </span>
              </div>
              <Heading as="h3" title={s.title} accent={s.accent} br className="step-card__title" />
              <p className="step-card__text">{s.text}</p>
              <Button to={s.cta.path} variant="outline" className="step-card__btn">
                {s.cta.label}
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------- steps: three more layouts (steps2) */
const stepsHead = {
  label: 'Як це працює',
  title: 'Від вибору гри',
  accent: 'до свята — 4 кроки',
  text: 'Без передоплати й складних форм. Ви обираєте — ми беремо на себе все інше.',
};

/** A · timeline on cream: numbered dots on one line, a column per step, one CTA */
export function StepsTimeline({ items = steps }) {
  return (
    <section className="section section--cream steps-line">
      <div className="container">
        <SectionHead {...stepsHead} br labelTone="white" />
        <ol className="steps-line__list" role="list">
          {items.map((s, i) => (
            <li key={s.no} className="steps-line__item rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
              <span className="steps-line__dot">{s.no}</span>
              <span className="steps-line__time">
                <Icon name="clock" size={14} /> {s.meta}
              </span>
              <Heading as="h3" title={s.title} accent={s.accent} br className="steps-line__title" />
              <p className="steps-line__text">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="steps-line__actions rv" data-reveal="90" style={{ '--rv-delay': '0.6s' }}>
          <Button to="/contacts">Забронювати ігри</Button>
          <Button to="/games" variant="outline">До каталогу</Button>
        </div>
      </div>
    </section>
  );
}

/** B · split on white: heading, text, buttons and a photo on the left; big numbered steps on the right */
export function StepsSplit({ items = steps }) {
  return (
    <section className="section steps-split">
      <div className="container steps-split__grid">
        <div className="steps-split__side">
          <SectionHead {...stepsHead} br align="left" labelTone="cream" />
          <div className="steps-split__actions">
            <Button to="/contacts">Забронювати ігри</Button>
            <Button to="/games" variant="outline">До каталогу</Button>
          </div>
          <div className="steps-split__photo">
            <Media photo="gal-jenga-guests-day" />
          </div>
        </div>
        <ol className="steps-split__list" role="list">
          {items.map((s, i) => (
            <li key={s.no} className="steps-split__item rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
              <span className="steps-split__no">{s.no}</span>
              <div className="steps-split__body">
                <Heading as="h3" title={s.title} accent={s.accent} className="steps-split__title" />
                <p className="steps-split__text">{s.text}</p>
              </div>
              <span className="steps-split__time">
                <Icon name="clock" size={14} /> {s.meta}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** C · photo cards on dark: a real event photo per step, text over a shade */
const stepPhotos = ['gal-park-connect4-jenga', 'gal-festival-table', 'gal-guests-tent', 'gal-jenga-guests-night'];
export function StepsPhotoCards({ items = steps }) {
  return (
    <section className="section section--dark steps-photo">
      <div className="container">
        <SectionHead {...stepsHead} br className="section-head--on-dark" />
        <ol className="steps-photo__list" role="list">
          {items.map((s, i) => (
            <li key={s.no} className="steps-photo__card rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
              <Media photo={stepPhotos[i]} />
              <span className="steps-photo__shade" aria-hidden="true" />
              <span className="steps-photo__no">{s.no}</span>
              <span className="steps-photo__time">
                <Icon name="clock" size={14} /> {s.meta}
              </span>
              <div className="steps-photo__body">
                <Heading as="h3" title={s.title} accent={s.accent} br className="steps-photo__title" />
                <p className="steps-photo__text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="steps-photo__actions rv" data-reveal="90" style={{ '--rv-delay': '0.6s' }}>
          <Button to="/contacts" variant="light">Забронювати ігри</Button>
        </div>
      </div>
    </section>
  );
}

const studies = {
  usecases: [
    ['Варіант 1 · Список подій і фото, що змінюється', UseCasesSplit],
    ['Варіант 2 · Фото-плитки 3 × 2', UseCasesTiles],
    ['Варіант 3 · Рядки з іграми під кожну подію', UseCasesSection],
  ],
  steps: [
    ['Як це працює · Білі картки на темному фоні', () => <StepsCards tone="white" />],
    ['Як це працює · Білі картки на світлому фоні', () => <StepsCards tone="light" />],
  ],
  steps2: [
    ['Як це працює · A · Таймлайн на кремовому', StepsTimeline],
    ['Як це працює · B · Заголовок і фото зліва, великі номери справа', StepsSplit],
    ['Як це працює · C · Фото-картки на темному', StepsPhotoCards],
  ],
};

export default function Lab({ slug = 'usecases' }) {
  const list = studies[slug] || studies.usecases;
  return (
    <main className="lab">
      {list.map(([label, Section]) => (
        <div key={label}>
          <p className="lab__label">{label}</p>
          <Section />
        </div>
      ))}
    </main>
  );
}
