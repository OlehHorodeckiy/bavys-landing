import { useEffect, useRef, useState } from 'react';
import { games } from '../data/games.js';
import { inventory } from '../data/inventory.js';
import { useFanSpread } from '../components/motion.jsx';
import { homeGallery } from '../data/gallery.js';
import { Button, Chip, GameMedia, MarqueeLink, MarqueeTrack, Rule, SectionHead } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { href, navigate } from '../router.js';
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

/**
 * Desktop only (a mouse, motion allowed): over the section the pointer becomes
 * the «Більше про нас» capsule, trailing the mouse; a click anywhere that is
 * not a link opens /about. Over links the normal pointer comes back.
 */
function useSectionCursor(section, cursor, to) {
  useEffect(() => {
    const sec = section.current;
    const el = cursor.current;
    if (!sec || !el) return undefined;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches || reduce.matches) return undefined;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let shown = false;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const overLink = !!e.target.closest('a, button');
      if (!shown) {
        x = tx;
        y = ty;
      }
      shown = !overLink;
      el.classList.toggle('is-on', shown);
      sec.classList.toggle('has-cursor', shown);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      shown = false;
      el.classList.remove('is-on');
      sec.classList.remove('has-cursor');
    };
    const click = (e) => {
      if (e.button !== 0 || e.target.closest('a, button')) return;
      navigate(to);
    };
    sec.addEventListener('mousemove', move);
    sec.addEventListener('mouseleave', leave);
    sec.addEventListener('click', click);
    return () => {
      cancelAnimationFrame(raf);
      sec.removeEventListener('mousemove', move);
      sec.removeEventListener('mouseleave', leave);
      sec.removeEventListener('click', click);
      leave();
    };
  }, [section, cursor, to]);
}

function Intro() {
  const [a, b, c] = [games[1], games[0], games[2]];
  const fan = useRef(null);
  const section = useRef(null);
  const cursor = useRef(null);
  useFanSpread(fan);
  useSectionCursor(section, cursor, '/about');
  return (
    <section className="section section--cream intro-section" id="pro-bavys" ref={section}>
      <div className="cursor-marquee" ref={cursor} aria-hidden="true">
        <span className="cursor-marquee__card">
          <MarqueeTrack>Більше про нас</MarqueeTrack>
        </span>
      </div>
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
          <MarqueeLink to="/about">Більше про нас</MarqueeLink>
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
