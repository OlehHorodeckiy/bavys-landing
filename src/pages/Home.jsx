import { useEffect, useRef, useState } from 'react';
import { games } from '../data/games.js';
import { inventory } from '../data/inventory.js';
import { useFanSpread } from '../components/motion.jsx';
import { homeGallery } from '../data/gallery.js';
import { Button, Chip, GameMedia, Rule, SectionHead } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { href } from '../router.js';
import {
  CtaBanner,
  GalleryBento,
  GameGrid,
  GameStrip,
  PageHero,
  StatsRow,
  StepsTiles,
  UseCasesSection,
  FaqSection,
} from '../components/sections.jsx';

const featured = games.filter((g) => g.featured);

/** Six random games from the whole catalog, new on every visit. The prerendered
 *  page keeps the featured six (search engines and the first paint see those);
 *  the swap happens after load, while the section is still below the fold. */
function useRandomGames() {
  const [list, setList] = useState(featured);
  useEffect(() => {
    const pool = [...games];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setList(pool.slice(0, featured.length));
  }, []);
  return list;
}

/** «Більше про нас»: a smooth scroll down to «Про Бавись» (a jump with reduced motion). */
function toAbout(e) {
  const target = document.getElementById('pro-bavys');
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

function HomeHero() {
  return (
    <PageHero
      size="home"
      align="left"
      reveal
      media={{ photo: 'lawn-white' }}
      title="Великі дерев’яні ігри"
      accent="для подій у Львові"
      text={'Привозимо Дженгу, корнхол та інші дерев’яні ігри на весілля, дні народження, корпоративи й сімейні свята.'}
      actions={
        <Button href="#pro-bavys" variant="outline" disc icon="arrowDown" onClick={toAbout}>
          Більше про нас
        </Button>
      }
    >
      <GameStrip games={inventory} />
    </PageHero>
  );
}

function Intro() {
  const [a, b, c] = [games[1], games[0], games[2]];
  const fan = useRef(null);
  useFanSpread(fan);
  return (
    <section className="section section--cream intro-section" id="pro-bavys">
      <div className="container">
        <SectionHead
          reveal
          label="Про Бавись"
          title="Великі ігри,"
          accent="справжні емоції"
          br
          text="Ми збираємо колекцію дерев’яних ігор, у які хочеться грати всім — від дітей до бабусь, від колег до нових родичів. І привозимо їх туди, де ви святкуєте."
        />
        <div className="fan rv" data-reveal="80" style={{ '--rv-delay': '0.6s' }} ref={fan} aria-hidden="true">
          <div className="fan__card fan__card--left">
            <GameMedia game={a} />
            <Chip dot="#E0A15E">Для дітей</Chip>
          </div>
          <div className="fan__card fan__card--center">
            <GameMedia game={b} />
            <Chip dot="#C78460">Хіт весіль</Chip>
          </div>
          <div className="fan__card fan__card--right">
            <GameMedia game={c} />
            <Chip dot="#4F7D00">Надворі</Chip>
          </div>
        </div>
        <Rule />
        <StatsRow reveal />
        <div className="section-actions">
          <Button to="/about">Більше про нас</Button>
        </div>
      </div>
    </section>
  );
}

function GamesPreview() {
  const shown = useRandomGames();
  return (
    <section className="section games-preview">
      <div className="container">
        <SectionHead
          label="Каталог"
          labelTone="cream"
          title="Ігри, які"
          accent="збирають гостей"
          br
          text="Від компактних настільних до гігантських ігор на газон — кожну привеземо підготовленою й чистою."
        />
        <GameGrid games={shown} />
        <div className="section-actions rv" data-reveal="90" style={{ '--rv-delay': '0.2s' }}>
          <Button to="/games">Переглянути всі ігри</Button>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section section--cream gallery-preview">
      <div className="container">
        <SectionHead reveal label="Галерея" title="Моменти" accent="з наших подій" br />
      </div>
      <GalleryBento items={homeGallery} className="rv" data-reveal="90" style={{ '--rv-delay': '0.4s' }} />
      <div className="container">
        <p className="gallery-preview__more rv" data-reveal="90" style={{ '--rv-delay': '0.2s' }}>
          <a href={href('/gallery')}>
            Дивитися всю галерею <Icon name="arrowUpRight" size={16} />
          </a>
        </p>
        {/* the booking banner closes the gallery section */}
        <CtaBanner bare />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HomeHero />
      <Intro />
      <GamesPreview />
      <StepsTiles />
      <UseCasesSection />
      <FaqSection />
      <GalleryPreview />
    </>
  );
}
