import { findGame, games, placeLabel } from '../data/games.js';
import { eventType, useCases } from '../data/site.js';
import { href } from '../router.js';
import Icon from '../components/Icon.jsx';
import { Button, Chip, GameMedia, Heading, Media, Pill, SectionHead } from '../components/ui.jsx';
import { CtaBanner, GameGrid, PageHero } from '../components/sections.jsx';
import NotFound from './NotFound.jsx';

/** "Велика Дженга" + accent "Дженга" → ["Велика", "Дженга"]. */
function splitName(game) {
  const { name, accent } = game;
  if (accent && accent !== name && name.endsWith(accent)) return [name.slice(0, -accent.length).trim(), accent];
  return [name, null];
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ block: 'start' });

function Facts({ game }) {
  const facts = [
    { icon: 'users', label: 'Гравців', value: game.players },
    { icon: 'age', label: 'Вік', value: game.age },
    { icon: 'timer', label: 'Тривалість', value: game.time },
    { icon: game.place === 'outdoor' ? 'sun' : game.place === 'indoor' ? 'home' : 'area', label: 'Де грати', value: placeLabel[game.place] },
  ];
  return (
    <div className="container">
      <dl className="facts">
        {facts.map((f) => (
          <div className="facts__item" key={f.label}>
            <dt>
              <Icon name={f.icon} size={16} /> {f.label}
            </dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function GameHero({ game }) {
  const [title, accent] = splitName(game);
  const label = game.events.slice(0, 2).map((e) => eventType(e)?.label).join(' · ');
  const actions = (
    <>
      <Button to="/contacts" query={{ game: game.slug }} variant="light">
        Забронювати цю гру
      </Button>
      <Button variant="outline-light" onClick={() => scrollTo('rules')}>
        Як грати
      </Button>
    </>
  );

  if (game.hero) {
    return (
      <PageHero media={game.hero} label={label} title={title} accent={accent} br={false} text={game.lead} actions={actions} className="hero--game">
        <Facts game={game} />
      </PageHero>
    );
  }

  /* No event photo yet — a product-style hero with the game's tile. */
  return (
    <section className="hero hero--product">
      <div className="container hero-product">
        <div className="hero__inner hero__inner--left">
          <Pill>{label}</Pill>
          <Heading as="h1" title={title} accent={accent} className="hero__title" />
          <p className="hero__text">{game.lead}</p>
          <div className="hero__actions">{actions}</div>
        </div>
        <div className="hero-product__stage">
          <GameMedia game={game} eager />
        </div>
      </div>
      <Facts game={game} />
    </section>
  );
}

export default function Game({ slug }) {
  const game = findGame(slug);
  if (!game) return <NotFound />;

  const aboutMedia = game.gallery[0] || null;
  const rulesMedia = game.gallery[2] || { photo: game.photo, art: game.art };
  const related = games
    .filter((g) => g.slug !== game.slug)
    .map((g) => ({ g, score: g.tags.filter((t) => game.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ g }) => g);

  const specs = [
    { icon: 'users', label: 'Кількість гравців', value: game.players },
    { icon: 'age', label: 'Рекомендований вік', value: game.age },
    { icon: 'ruler', label: 'Розміри гри', value: game.size },
    { icon: 'area', label: 'Потрібне місце', value: game.space },
    { icon: game.place === 'outdoor' ? 'sun' : 'home', label: 'Надворі / у приміщенні', value: placeLabel[game.place] },
    { icon: 'timer', label: 'Середня тривалість партії', value: game.time },
    { icon: 'wallet', label: 'Вартість оренди', value: game.price || 'розрахуємо під вашу подію' },
    { icon: 'truck', label: 'Доставка й встановлення', value: 'Львів та область' },
  ];

  return (
    <>
      <GameHero game={game} />

      {/* ---------------------------------------------------- About */}
      <section className="section section--cream game-about">
        <div className="container game-about__grid">
          <div className="game-about__main">
            <Heading as="h2" title="Що це" accent="за гра?" className="section-head__title" />
            {aboutMedia ? (
              <div className="game-about__media">
                <Media {...aboutMedia} alt={game.name} />
              </div>
            ) : (
              <p className="game-about__quote">{game.short}</p>
            )}
          </div>
          <div className="game-about__copy">
            {game.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="game-about__chips">
              <Chip icon="users" tone="soft">{game.players} гравців</Chip>
              <Chip icon="age" tone="soft">Вік {game.age}</Chip>
              {game.price ? <Chip icon="wallet" tone="soft">{game.price}</Chip> : null}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Rules */}
      <section className="section game-rules" id="rules">
        <div className="container">
          <SectionHead label="Як грати" labelTone="cream" title="Правила" accent="за одну хвилину" text="На місці адміністратор покаже все наживо, але ось коротко — щоб знати заздалегідь." />
          <div className="game-rules__grid">
            <ol className="rules">
              {game.rules.map((r, i) => (
                <li key={r.title} className="rules__item">
                  <span className="rules__no">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="game-rules__media">
              <Media {...rulesMedia} alt={game.name} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Events */}
      <section className="section section--cream game-events">
        <div className="container split-head split-head--top">
          <SectionHead title="Для яких" accent="подій?" br align="left" text="Де ця гра працює найкраще — з нашого досвіду сотень свят." />
          <ul className="event-list" role="list">
            {game.events.map((id) => {
              const t = eventType(id);
              const uc = useCases.find((u) => u.id === id || (id === 'kids' && u.id === 'birthday'));
              return (
                <li key={id}>
                  <a className="event-list__item" href={href('/games', { type: id === 'teambuilding' ? 'corporate' : id })}>
                    <span className="event-list__dot" style={{ background: t?.dot }} aria-hidden="true" />
                    <span className="event-list__label">{t?.label}</span>
                    <span className="event-list__note">{uc?.note || 'Спокійна гра для дітей і батьків'}</span>
                    <Icon name="arrowUpRight" size={18} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------- Details */}
      <section className="section section--dark game-details">
        <div className="container">
          <SectionHead label="Деталі гри" title="Усе, що варто" accent="знати заздалегідь" br className="section-head--on-dark" />
          <dl className="specs">
            {specs.map((s) => (
              <div className="specs__row" key={s.label}>
                <dt>
                  <span className="specs__icon">
                    <Icon name={s.icon} size={20} />
                  </span>
                  {s.label}
                </dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------- Gallery */}
      {game.gallery.length ? (
        <section className="section game-gallery">
          <div className="container">
            <SectionHead label="Галерея" labelTone="cream" title="Гра" accent="на наших подіях" br />
            <div className="game-gallery__grid">
              {game.gallery.map((item, i) => (
                <figure key={i} className="game-gallery__item">
                  <Media photo={item.photo} position={item.position} alt={item.caption} />
                  <figcaption>
                    <Chip dot="#C78460">{item.caption}</Chip>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner
        label="Бронювання"
        title="Хочете цю гру"
        accent="на своїй події?"
        text={`Натисніть «Надіслати заявку» — «${game.name}» вже буде обрана у формі. Адміністратор підтвердить наявність на вашу дату.`}
        query={{ game: game.slug }}
        media={game.hero || null}
        secondary={false}
      />

      {/* ---------------------------------------------------- Related */}
      <section className="section game-related">
        <div className="container">
          <div className="split-head split-head--center">
            <Heading as="h2" title="Інші" accent="ігри" className="section-head__title" />
            <Button to="/games" variant="outline" disc={false}>
              Весь каталог <Icon name="arrowRight" size={16} />
            </Button>
          </div>
          <GameGrid games={related} />
        </div>
      </section>
    </>
  );
}
