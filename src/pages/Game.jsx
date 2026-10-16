import { findGame, gamePrice, games, placeLabel, rental } from '../data/games.js';
import { eventType } from '../data/site.js';
import Icon from '../components/Icon.jsx';
import { Button, Heading, Media, Pill } from '../components/ui.jsx';
import { FaqSection, GameGrid } from '../components/sections.jsx';
import NotFound from './NotFound.jsx';
import { BookGameButton } from '../components/AddToCart.jsx';

/** "Велика Дженга" + accent "Дженга" → ["Велика", "Дженга"]. */
function splitName(game) {
  const { name, accent } = game;
  if (accent && accent !== name && name.endsWith(accent)) return [name.slice(0, -accent.length).trim(), accent];
  return [name, null];
}

/** An icon for a kit line: bags and boxes, boards and fields, the pieces themselves. */
const kitIcon = (k) =>
  /сумк|мішеч|коробк|кейс/i.test(k) ? 'bag' : /пол|дошк|щит|платформ|рамк|конструкц|доріжк|стіл|підставк/i.test(k) ? 'area' : 'blocks';

const placeIcon = (p) => (p === 'outdoor' ? 'sun' : p === 'indoor' ? 'home' : 'homeSun');

/**
 * Light first screen: white backdrop with a lawn strip along the bottom, text
 * on the left (label, two-tone name, lead, four facts in a 2×2 grid, one button
 * that puts the game in the cart) and the game photo on the right in a 1554:1402 box, centred on the text.
 */
function GameHero({ game }) {
  const [title, accent] = splitName(game);
  const label = game.events.slice(0, 2).map((e) => eventType(e)?.label).join(' · ');
  const facts = [
    { icon: 'users', value: `${game.players} гравців` },
    { icon: 'wallet', value: gamePrice(game) },
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
          <BookGameButton game={game} className="game-hero__cta" />
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

  // «Що варто знати»: the game's own facts, then the table line for table games
  const know = [...(game.know || []), ...(game.table ? [{ icon: 'cafeTable', text: `Потрібен стіл. Немає свого? Візьміть наш за ${rental.table}` }] : [])];
  return (
    <>
      <GameHero game={game} />

      {/* -------------------- Rules, kit and what to know (Figma «Правила за одну хвилину», варіант 1) */}
      <section className="section section--cream game-play" id="rules">
        <div className="container">
          <div className="game-play__head">
            <Heading as="h2" title="Правила" accent="за одну хвилину" className="game-play__title" />
            <p>На місці адміністратор покаже все наживо.</p>
          </div>
          <ol className="game-play__steps" role="list">
            {game.rules.map((r, i) => (
              <li key={r.title} className="play-step">
                <span className="play-step__no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="game-play__cards">
            <div className="play-card">
              <h3>Що в комплекті</h3>
              <ul role="list">
                {game.kit.map((k) => (
                  <li key={k}>
                    <span className="play-card__icon" aria-hidden="true">
                      <Icon name={kitIcon(k)} size={24} strokeWidth={1.5} />
                    </span>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
            {know.length ? (
              <div className="play-card">
                <h3>Що варто знати</h3>
                <ul role="list">
                  {know.map((k) => (
                    <li key={k.text}>
                      <span className="play-card__icon" aria-hidden="true">
                        <Icon name={k.icon} size={24} strokeWidth={1.5} />
                      </span>
                      {k.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

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

      <FaqSection book={game.slug} />
    </>
  );
}
