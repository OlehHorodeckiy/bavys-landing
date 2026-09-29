/**
 * Reusable page sections and cards. Each maps to a pattern in the reference
 * (Calmlyss) and is reused across pages rather than rebuilt per page.
 */
import { eventType, stats as defaultStats, steps as defaultSteps, advantages as defaultAdvantages, useCases as defaultUseCases } from '../data/site.js';
import { placeLabel } from '../data/games.js';
import { blogCategory } from '../data/posts.js';
import { href } from '../router.js';
import Icon from './Icon.jsx';
import { Button, Chip, GameMedia, Heading, Media, Pill, SectionHead } from './ui.jsx';

/* ------------------------------------------------------------- Page hero */

/**
 * Dark photographic hero — every page opens with one, the header floats on it.
 * size: 'home' (tall, left-aligned) | 'page' (centered) | 'short'
 */
export function PageHero({ media, label, title, accent, br = true, text, actions, align = 'center', size = 'page', children, className = '' }) {
  return (
    <section className={`hero hero--${size} ${className}`}>
      <div className="hero__bg">{media ? <Media {...media} eager /> : null}</div>
      <div className="hero__shade" aria-hidden="true" />
      <div className={`container hero__inner hero__inner--${align}`}>
        {label ? <Pill>{label}</Pill> : null}
        <Heading as="h1" title={title} accent={accent} br={br} className="hero__title" />
        {text ? <p className="hero__text">{text}</p> : null}
        {actions ? <div className="hero__actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------ Arch strip of games */

/** Row of arch-shaped game tiles that runs off both edges (reference hero strip). */
export function GameStrip({ games }) {
  return (
    <div className="hero-strip" aria-label="Ігри з колекції">
      <ul className="hero-strip__list" role="list">
        {games.map((g) => (
          <li key={g.slug}>
            <a className="hero-strip__arch" href={href(`/games/${g.slug}`)}>
              <GameMedia game={g} alt="" />
              <span className="hero-strip__name">{g.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------- Game card */

export function GameCard({ game, headingLevel = 'h3' }) {
  const H = headingLevel;
  const primary = eventType(game.events[0]);
  return (
    <a className="game-card" href={href(`/games/${game.slug}`)}>
      <div className="game-card__media">
        <GameMedia game={game} alt="" />
        <div className="game-card__chips">
          <Chip dot={primary?.dot}>{primary?.label}</Chip>
          <Chip icon="users">{game.players}</Chip>
        </div>
      </div>
      <H className="game-card__title">{game.name}</H>
      <p className="game-card__text">{game.short}</p>
      <div className="game-card__foot">
        <span className="game-card__meta">
          <Icon name={game.place === 'outdoor' ? 'sun' : game.place === 'indoor' ? 'home' : 'area'} size={16} />
          {placeLabel[game.place]}
        </span>
        <span className="game-card__arrow" aria-hidden="true">
          <Icon name="arrowUpRight" size={16} strokeWidth={1.8} />
        </span>
      </div>
    </a>
  );
}

export function GameGrid({ games, headingLevel }) {
  return (
    <ul className="game-grid" role="list">
      {games.map((g) => (
        <li key={g.slug}>
          <GameCard game={g} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- Post card */

export function PostCard({ post, layout = 'col', headingLevel = 'h3' }) {
  const H = headingLevel;
  const cat = blogCategory(post.category);
  return (
    <a className={`post-card post-card--${layout}`} href={href(`/blog/${post.slug}`)}>
      <div className="post-card__media">
        <Media {...post.media} alt="" />
        <Chip dot="#866452">{cat?.label}</Chip>
      </div>
      <div className="post-card__body">
        <H className="post-card__title">{post.title}</H>
        <p className="post-card__text">{post.excerpt}</p>
        <div className="post-card__meta">
          <Chip icon="calendar" tone="soft">{post.date}</Chip>
          <Chip icon="clock" tone="soft">{post.read}</Chip>
        </div>
      </div>
    </a>
  );
}

/* ---------------------------------------------------------- Gallery grid */

/**
 * layout 'editorial' — the reference's mosaic (big · tall · squares · panorama);
 * layout 'uniform'   — an even grid, used for filtered results.
 */
export function GalleryGrid({ items, layout = 'editorial', moreTile = true }) {
  return (
    <div className={`gallery-grid gallery-grid--${layout}`}>
      {items.map((item, i) => (
        <figure key={`${item.photo}-${i}`} className="gallery-tile">
          <Media photo={item.photo} position={item.position} alt={item.caption} />
          <figcaption>{item.caption}</figcaption>
        </figure>
      ))}
      {moreTile ? (
        <a className="gallery-tile gallery-tile--more" href="https://instagram.com/" target="_blank" rel="noreferrer">
          <Icon name="instagram" size={28} />
          <strong>Більше фото з подій</strong>
          <span>у нашому Instagram</span>
        </a>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ Stats row */

export function StatsRow({ items = defaultStats }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stats__item" key={s.title}>
          <p className="stats__value">
            {s.value}
            {s.suffix ? <sup>{s.suffix}</sup> : null}
          </p>
          <Heading as="h3" title={s.title} accent={s.accent} className="stats__title" />
          <p className="stats__text">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------- How it works (dark) */

export function StepsSection({ items = defaultSteps, label = 'Як це працює', title = 'Від вибору гри', accent = 'до свята — 4 кроки', text = 'Без передоплати й складних форм. Ви обираєте — ми беремо на себе все інше.' }) {
  return (
    <section className="section section--dark steps-section" id="how">
      <div className="container">
        <SectionHead label={label} title={title} accent={accent} br text={text} className="section-head--on-dark" />
        <ol className="steps">
          {items.map((s) => (
            <li className="steps__row" key={s.no}>
              <span className="steps__no">{s.no}</span>
              <Heading as="h3" title={s.title} accent={s.accent} className="steps__title" />
              <p className="steps__text">{s.text}</p>
              <span className="steps__meta">
                <Icon name="clock" size={16} /> {s.meta}
              </span>
              <Button to={s.cta.path} variant="outline-light" className="steps__btn">
                {s.cta.label}
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Why choose us (cards) */

export function AdvantagesSection({ items = defaultAdvantages, label = 'Чому Бавись', title = 'Сервіс, на який', accent = 'можна покластися', text, tone = 'cream' }) {
  const dark = tone === 'dark';
  return (
    <section className={`section ${dark ? 'section--glow' : 'section--cream'} advantages-section`}>
      <div className="container">
        <div className="split-head">
          <SectionHead label={label} title={title} accent={accent} br align="left" className={dark ? 'section-head--on-dark' : ''} />
          {text ? <p className={`split-head__text ${dark ? 'split-head__text--light' : ''}`}>{text}</p> : null}
        </div>
        <ul className="advantages" role="list">
          {items.map((a) => (
            <li className="advantage" key={a.title}>
              <span className="advantage__icon">
                <Icon name={a.icon} size={24} />
              </span>
              <Heading as="h3" title={a.title} accent={a.accent} className="advantage__title" />
              <p>{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------- Events / use cases */

export function UseCasesSection({ items = defaultUseCases, label = 'Для яких подій', title = 'Ігри, які доречні', accent = 'на будь-якому святі', className = '' }) {
  return (
    <section className={`section usecases-section ${className}`}>
      <div className="container">
        <SectionHead label={label} labelTone="cream" title={title} accent={accent} br />
      </div>
      <ul className="usecases" role="list">
        {items.map((u) => (
          <li key={u.id}>
            <a className="usecase" href={href('/games', { type: u.id === 'teambuilding' ? 'corporate' : u.id })}>
              <div className="usecase__arch">
                <Media {...u.media} alt="" />
              </div>
              <h3 className="usecase__title">{u.title}</h3>
              <p className="usecase__note">{u.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------- CTA banner */

export function CtaBanner({
  label = 'Бронювання',
  title = 'Зробимо ваше свято',
  accent = 'веселішим',
  text = 'Залиште заявку — адміністратор зв’яжеться з вами, підбере ігри під формат події та підтвердить наявність на вашу дату.',
  query,
  media = { photo: 'event-jenga', position: '70% 60%' },
  secondary = true,
  tone = 'cream',
}) {
  return (
    <section className={`section section--${tone} cta-section`}>
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner__bg">{media ? <Media {...media} alt="" /> : null}</div>
          <div className="cta-banner__shade" aria-hidden="true" />
          <div className="cta-banner__inner">
            <Pill>{label}</Pill>
            <Heading as="h2" title={title} accent={accent} br className="cta-banner__title" />
            <p className="cta-banner__text">{text}</p>
            <div className="cta-banner__actions">
              <Button to="/contacts" query={query} variant="light">
                Надіслати заявку
              </Button>
              {secondary ? (
                <Button to="/games" variant="outline-light">
                  Переглянути ігри
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Filter bar */

export function FilterBar({ items, value, onChange, label, className = '' }) {
  return (
    <div className={`filter-bar ${className}`} role="toolbar" aria-label={label}>
      {items.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`filter-bar__btn ${value === f.id ? 'is-active' : ''}`}
          aria-pressed={value === f.id}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
