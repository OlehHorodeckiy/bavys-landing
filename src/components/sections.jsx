/**
 * Reusable page sections and cards. Each maps to a pattern in the reference
 * (Calmlyss) and is reused across pages rather than rebuilt per page.
 */
import { useId, useState } from 'react';
import { company, eventType, stats as defaultStats, steps as defaultSteps, advantages as defaultAdvantages, useCases as defaultUseCases } from '../data/site.js';
import { findGame, games as allGames } from '../data/games.js';
import { CountUp } from './motion.jsx';
import { blogCategory } from '../data/posts.js';
import { faq as defaultFaq } from '../data/faq.js';
import { href } from '../router.js';
import Icon from './Icon.jsx';
import { Button, Chip, GameMedia, Heading, Media, Pill, SectionHead } from './ui.jsx';

/* ------------------------------------------------------------- Page hero */

/**
 * Dark photographic hero — every page opens with one, the header floats on it.
 * size: 'home' (tall, left-aligned) | 'page' (centered) | 'short'
 */
export function PageHero({ media, label, title, accent, br = true, text, actions, align = 'center', size = 'page', reveal = false, children, className = '' }) {
  return (
    <section className={`hero hero--${size} ${className}`}>
      <div className="hero__bg">{media ? <Media {...media} eager /> : null}</div>
      <div className="hero__shade" aria-hidden="true" />
      <div className={`container hero__inner hero__inner--${align}`}>
        {label ? <Pill>{label}</Pill> : null}
        <Heading as="h1" title={title} accent={accent} br={br} reveal={reveal} className="hero__title" />
        {text ? <p className="hero__text">{text}</p> : null}
        {actions ? <div className="hero__actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* --------------------------------------------------------- Page title */

/**
 * Light first screen of the inner pages: an optional label pill, a two-tone
 * title in one line, an optional line of text, then whatever follows (filter
 * chips, the page content). Replaces the old dark photographic heroes.
 */
export function PageTitle({ label, title, accent, text, children, className = '' }) {
  return (
    <section className={`page-title ${className}`}>
      <div className="container page-title__inner">
        {label ? (
          <Pill tone="cream" className="rv" data-reveal="90">
            {label}
          </Pill>
        ) : null}
        <Heading as="h1" title={title} accent={accent} reveal className="page-title__title" />
        {text ? (
          <p className="page-title__text rv" data-reveal="90" style={{ '--rv-delay': '0.3s' }}>
            {text}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------ Arch strip of games */

/**
 * Row of arch-shaped game tiles that loops endlessly to the left (Calmlyss hero
 * marquee). The list is rendered twice so the loop is seamless; the copy is
 * hidden from assistive tech and the tab order. Hovering a tile fades in a dark
 * gradient and the game's name. A game without a catalog page yet links to the
 * catalog.
 */
export function GameStrip({ games }) {
  const tile = (g, copy) => (
    <li key={`${copy}-${g.slug}`} aria-hidden={copy ? 'true' : undefined}>
      <a className="hero-strip__arch" href={href(findGame(g.slug) ? `/games/${g.slug}` : '/games')} tabIndex={copy ? -1 : undefined}>
        <GameMedia game={g} alt="" />
        <span className="hero-strip__shade" aria-hidden="true" />
        <span className="hero-strip__name">{g.name}</span>
      </a>
    </li>
  );
  return (
    <div className="hero-strip" aria-label="Ігри з колекції">
      <ul className="hero-strip__list" role="list">
        {games.map((g) => tile(g, 0))}
        {games.map((g) => tile(g, 1))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------- Gallery bento */

/** Full-bleed photo mosaic from the Calmlyss gallery: 9 tiles, no captions. */
export function GalleryBento({ items, className = '', ...rest }) {
  return (
    <ul className={`bento ${className}`} role="list" {...rest}>
      {items.map((it) => (
        <li className="bento__tile" key={it.photo}>
          <Media photo={it.photo} />
        </li>
      ))}
    </ul>
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
        {game.isNew ? <span className="game-card__badge">Новинка</span> : null}
        <div className="game-card__chips">
          <Chip dot={primary?.dot}>{primary?.label}</Chip>
          <Chip icon="users">{game.players}</Chip>
        </div>
      </div>
      <H className="game-card__title">{game.name}</H>
      <p className="game-card__text">{game.short}</p>
    </a>
  );
}

export function GameGrid({ games, headingLevel }) {
  return (
    <ul className="game-grid" role="list">
      {games.map((g, i) => (
        <li key={g.slug} className="rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + (i % 3) * 0.06}s` }}>
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
        <a className="gallery-tile gallery-tile--more" href={company.socials[0].href} target="_blank" rel="noreferrer">
          <Icon name="instagram" size={28} />
          <strong>Більше фото з подій</strong>
          <span>у нашому Instagram</span>
        </a>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ Stats row */

/** `reveal`: items rise in 0.2s apart and the numbers count up (Calmlyss). */
export function StatsRow({ items = defaultStats, reveal = false }) {
  return (
    <div className="stats">
      {items.map((s, i) => (
        <div
          className={`stats__item ${reveal ? 'rv' : ''}`}
          key={s.title}
          data-reveal={reveal ? '90' : undefined}
          style={reveal ? { '--rv-delay': `${0.2 * (i + 1)}s` } : undefined}
        >
          <p className="stats__value">
            {reveal ? <CountUp value={s.value} /> : s.value}
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
          {items.map((s, i) => (
            <li className="steps__row rv" key={s.no} data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
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

/* ----------------------------------------- How to order (illustrated) */

const orderSteps = [
  { title: 'Оберіть ігри', text: 'Перегляньте каталог і додайте ігри, що пасують вашій події.' },
  { title: 'Надішліть заявку', text: 'Вкажіть дату, локацію та кількість гостей. Без передоплати.' },
  { title: 'Підтверджуємо наявність', text: 'Адміністратор зателефонує, уточнить деталі й зафіксує бронь.' },
  { title: 'Привозимо й встановлюємо', text: 'Доставляємо, розставляємо, пояснюємо правила і забираємо після свята.' },
];

/** Little interface sketches inside the step tiles (decorative). */
function StepArt({ i }) {
  if (i === 0) {
    return (
      <div className="step-art step-art--pick">
        <span className="step-art__card"><Media photo="card-velyka-dzhenga" alt="" /></span>
        <span className="step-art__card"><Media photo="card-kornkhol" alt="" /></span>
        <span className="step-art__plus"><Icon name="plus" size={16} strokeWidth={2.5} /></span>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="step-art step-art--form">
        {[['calendar', '12 липня'], ['pin', 'Львів'], ['users', '60 гостей']].map(([ic, v]) => (
          <span className="step-art__field" key={v}><Icon name={ic} size={14} />{v}</span>
        ))}
        <span className="step-art__btn">Надіслати заявку</span>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="step-art step-art--confirm">
        <span className="step-art__msg">
          <span className="step-art__ok"><Icon name="check" size={16} strokeWidth={2.5} /></span>
          <span><b>Бронь підтверджено</b><small>сьогодні о 14:20</small></span>
        </span>
        <span className="step-art__call"><Icon name="phone" size={20} /></span>
      </div>
    );
  }
  return (
    <div className="step-art step-art--deliver">
      <span className="step-art__ring" />
      <span className="step-art__disc"><Icon name="truck" size={36} /></span>
    </div>
  );
}

/**
 * «Як замовити ігри?»: four tiles with interface sketches, title and text under
 * each. tone 'white' — white section, cream tiles (home); 'cream' — the reverse (about).
 */
export function StepsTiles({ tone = 'white', items = orderSteps }) {
  return (
    <section className={`section ${tone === 'cream' ? 'section--cream' : ''} steps-tiles steps-tiles--${tone}`} id="how">
      <div className="container">
        <Heading as="h2" title="Як замовити" accent="ігри?" reveal className="steps-tiles__title" />
        <ol className="steps-tiles__list" role="list">
          {items.map((s, i) => (
            <li key={s.title} className="steps-tiles__item rv" data-reveal="90" style={{ '--rv-delay': `${0.3 + i * 0.06}s` }}>
              <div className="steps-tiles__tile" aria-hidden="true">
                <StepArt i={i} />
              </div>
              <h3 className="steps-tiles__name">{s.title}</h3>
              <p className="steps-tiles__text">{s.text}</p>
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

/** Games tagged for an occasion (team building borrows the corporate set). */
const occasionType = (id) => (id === 'teambuilding' ? 'corporate' : id);
export const gamesForOccasion = (id) => allGames.filter((g) => g.events.includes(occasionType(id)));

/** 1 гра · 2–4 гри · 5+ ігор */
export const gamesWord = (n) => {
  const d = n % 10;
  const h = n % 100;
  if (d === 1 && h !== 11) return `${n} гра`;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return `${n} гри`;
  return `${n} ігор`;
};

/**
 * "Для яких подій": one row per occasion — photo, name, note, the games that
 * suit it (first three + the rest as a count) and an arrow into the catalog
 * filtered by that occasion.
 */
export function UseCasesSection({
  items = defaultUseCases,
  label = 'Для яких подій',
  title = 'Ігри, які доречні',
  accent = 'на будь-якому святі',
  text = 'Оберіть подію — покажемо ігри, які на ній працюють найкраще.',
  className = '',
}) {
  return (
    <section className={`section uc-rows ${className}`}>
      <div className="container">
        <div className="split-head">
          <SectionHead label={label} labelTone="cream" title={title} accent={accent} br align="left" />
          {text ? (
            <p className="split-head__text rv" data-reveal="90" style={{ '--rv-delay': '0.4s' }}>
              {text}
            </p>
          ) : null}
        </div>
        <ul className="uc-rows__list" role="list">
          {items.map((u, i) => {
            const picks = gamesForOccasion(u.id);
            return (
              <li key={u.id} className="rv" data-reveal="90" style={{ '--rv-delay': `${0.4 + i * 0.06}s` }}>
                <a className="uc-row" href={href('/games', { type: occasionType(u.id) })}>
                  <span className="uc-row__thumb">
                    <Media photo={u.photo} alt="" />
                  </span>
                  <span className="uc-row__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="uc-row__text">
                    <span className="uc-row__title">{u.title}</span>
                    <span className="uc-row__note">{u.note}</span>
                  </span>
                  <span className="uc-row__games" aria-label={gamesWord(picks.length)}>
                    {picks.slice(0, 3).map((g) => (
                      <Chip key={g.slug} tone="soft">
                        {g.name}
                      </Chip>
                    ))}
                    {picks.length > 3 ? <Chip tone="soft">+{picks.length - 3}</Chip> : null}
                  </span>
                  <span className="uc-row__arrow" aria-hidden="true">
                    <Icon name="arrowUpRight" size={18} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- CTA banner */

/**
 * Booking banner: a light card with the lawn photo (Велика Дженга left, ring
 * toss right) along its bottom, a two-tone title and one «Замовити ігри» that
 * opens the booking popup. `bare` renders only the card (the home page puts it
 * inside the gallery section); otherwise it comes in its own section.
 */
export function CtaBanner({ title = 'Плануєте свято?', accent = 'ігри беремо на себе', book = true, tone = 'white', bare = false, className = '' }) {
  const card = (
    <div className={`cta-banner ${className}`}>
      <div className="cta-banner__photo" aria-hidden="true">
        <Media photo="cta-lawn" alt="" />
      </div>
      <div className="cta-banner__inner">
        <Heading as="h2" title={title} accent={accent} br reveal className="cta-banner__title" />
        <div className="cta-banner__actions rv" data-reveal="90" style={{ '--rv-delay': '0.3s' }}>
          <Button book={book}>Замовити ігри</Button>
        </div>
      </div>
    </div>
  );
  if (bare) return card;
  return (
    <section className={`section section--${tone} cta-section`}>
      <div className="container">{card}</div>
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

/* ---------------------------------------------------------- FAQ */

/**
 * «Часті питання»: head + booking button + phone on the left, the accordion on
 * the right (on phones: head, list, then the button). The first answer starts
 * open; every answer is in the HTML for search engines, collapsed ones are hidden.
 */
export function FaqSection({ items = defaultFaq, book = true, className = '' }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  return (
    <section className={`section faq-section ${className}`}>
      <div className="container faq">
        <div className="faq__head">
          <Pill tone="cream" className="rv" data-reveal="90">
            Питання й відповіді
          </Pill>
          <Heading as="h2" title="Часті" accent="питання" br reveal className="faq__title" />
          <p className="faq__text rv" data-reveal="90" style={{ '--rv-delay': '0.4s' }}>
            Не знайшли відповіді? Зателефонуйте або залиште заявку: адміністратор зв’яжеться з вами протягом доби.
          </p>
        </div>
        <ul className="faq__list" role="list">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <h3 className="faq__q">
                  <button type="button" aria-expanded={isOpen} aria-controls={`${uid}-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{it.q}</span>
                    <span className="faq__toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq__a" id={`${uid}-${i}`} role="region" aria-hidden={!isOpen}>
                  <div>
                    <p>{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="faq__actions">
          <Button book={book}>Поставити питання</Button>
          <a className="faq__phone" href={company.phoneHref}>
            <Icon name="phone" size={18} /> {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
