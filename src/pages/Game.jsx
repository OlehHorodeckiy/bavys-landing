import { findGame, games, placeLabel, rental } from '../data/games.js';
import { eventType } from '../data/site.js';
import Icon from '../components/Icon.jsx';
import { Button, Heading, Media, Pill, SectionHead } from '../components/ui.jsx';
import { CtaBanner, FaqSection, GameGrid } from '../components/sections.jsx';
import NotFound from './NotFound.jsx';

/** "Велика Дженга" + accent "Дженга" → ["Велика", "Дженга"]. */
function splitName(game) {
  const { name, accent } = game;
  if (accent && accent !== name && name.endsWith(accent)) return [name.slice(0, -accent.length).trim(), accent];
  return [name, null];
}

const placeIcon = (p) => (p === 'outdoor' ? 'sun' : p === 'indoor' ? 'home' : 'area');

/**
 * Light first screen: white backdrop with a lawn strip along the bottom, text
 * on the left (label, two-tone name, lead, four facts in a 2×2 grid, one booking
 * button) and the game photo on the right in a 1554:1402 box, centred on the text.
 */
function GameHero({ game }) {
  const [title, accent] = splitName(game);
  const label = game.events.slice(0, 2).map((e) => eventType(e)?.label).join(' · ');
  const facts = [
    { icon: 'users', value: `${game.players} гравців` },
    { icon: 'wallet', value: rental.price },
    { icon: 'calendar', value: 'Оренда на добу' },
    { icon: placeIcon(game.place), value: placeLabel[game.place] },
  ];
  return (
    <section className="game-hero">
      <div className="game-hero__bg" aria-hidden="true">
        <Media photo="lawn-strip" alt="" eager />
      </div>
      <div className="container game-hero__grid">
        <div className="game-hero__copy">
          <Pill tone="cream">{label}</Pill>
          <Heading as="h1" title={title} accent={accent} className="game-hero__title" />
          <p className="game-hero__lead">{game.lead}</p>
          <ul className="game-hero__facts" role="list">
            {facts.map((f) => (
              <li key={f.value}>
                <Icon name={f.icon} size={16} /> {f.value}
              </li>
            ))}
          </ul>
          <Button book={game.slug} className="game-hero__cta">
            Забронювати цю гру
          </Button>
        </div>
        <div className="game-hero__photo">
          <Media
            photo={game.hero || game.photo}
            art={game.art}
            alt={game.name}
            position={game.hero ? undefined : game.heroPosition || '50% 75%'}
            eager
          />
        </div>
      </div>
    </section>
  );
}

export default function Game({ slug }) {
  const game = findGame(slug);
  if (!game) return <NotFound />;

  const related = games
    .filter((g) => g.slug !== game.slug)
    .map((g) => ({ g, score: g.tags.filter((t) => game.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ g }) => g);

  // only real facts: the kit sheet, the rules sheet and the shared rental terms; short ones first
  const specs = [
    { icon: 'users', label: 'Кількість гравців', value: game.players },
    { icon: placeIcon(game.place), label: 'Де грати', value: placeLabel[game.place] },
    { icon: 'truck', label: 'Отримання', value: rental.delivery },
    { icon: 'tag', label: 'Застава', value: rental.deposit },
    { icon: 'calendar', label: 'Термін оренди', value: `${rental.term}. ${rental.returnBy}` },
    { icon: 'blocks', label: 'Комплектація', value: game.kit.join(', ') },
    { icon: 'wallet', label: 'Вартість оренди', value: `${rental.price} · ${rental.bundle}` },
    { icon: 'chat', label: 'Інструктор на події', value: rental.instructor },
  ];

  return (
    <>
      <GameHero game={game} />

      {/* ---------------------------------------- What it is + rules card */}
      <section className="section section--cream game-about">
        <div className="container game-about__grid">
          <div className="game-about__main">
            <Heading as="h2" title="Що це" accent="за гра?" className="game-about__title" />
            <p className="game-about__lead">{game.short}</p>
            <div className="game-about__copy">
              {game.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="rules-card" id="rules">
            <Heading as="h3" title="Правила" accent="за одну хвилину" className="rules-card__title" />
            <p className="rules-card__note">На місці адміністратор покаже все наживо.</p>
            <ol className="rules-card__list">
              {game.rules.map((r, i) => (
                <li key={r.title}>
                  <span className="rules-card__no">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Details */}
      <section className="section game-details">
        <div className="container">
          <SectionHead label="Деталі гри" labelTone="cream" title="Усе, що варто" accent="знати заздалегідь" br />
          <dl className="spec-tiles">
            {specs.map((s) => (
              <div className="spec-tiles__item" key={s.label}>
                <span className="spec-tiles__icon">
                  <Icon name={s.icon} size={20} />
                </span>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FaqSection book={game.slug} />

      <CtaBanner title="Хочете цю гру" accent="на своїй події?" book={game.slug} tone="cream" />

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
