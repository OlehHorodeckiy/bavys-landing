import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import VideoModal from '../components/VideoModal.jsx';
import { Heading, Logo, Media, Pill } from '../components/ui.jsx';
import { CtaBanner, PageTitle, StepsTiles } from '../components/sections.jsx';
import { games, rental } from '../data/games.js';
import { stats } from '../data/site.js';
import videoPreview from '../../assets/video/about-preview.mp4';
import videoFull from '../../assets/video/about.mp4';
import videoPoster from '../../assets/photos/about/video-poster.webp';

const service = [
  { icon: 'truck', text: 'Доставка по Львову та області у зручний для локації час' },
  { icon: 'blocks', text: 'Монтаж і розстановка ігрової зони під ваш простір' },
  { icon: 'chat', text: 'Пояснення правил гостям або адміністратор на місці' },
  { icon: 'sparkle', text: 'Чисті, відшліфовані ігри у фірмовому пакуванні' },
  { icon: 'calendar', text: 'Демонтаж і вивіз після завершення свята' },
  { icon: 'phone', text: 'Один адміністратор на зв’язку від заявки до кінця свята' },
];

// real numbers only: the catalog size, the rental price, where we work
const facts = [
  { value: String(games.length), text: 'дерев’яних ігор у колекції' },
  { value: `від ${rental.price.split(' / ')[0]}`, text: 'за гру на добу' },
  { value: 'Львів', text: 'та область, з доставкою' },
];

// the same «70+» as the home stats row
const done = stats.find((s) => s.accent === 'подій');
const eventsDone = `${done.value}${done.suffix}`;

/**
 * The bento's middle: a short silent loop of the team video (1 MB, plays by
 * itself, paused with reduced motion) under a play button; the button opens the
 * full 42 s video with sound over a dimmed page.
 */
function AboutVideo() {
  const [open, setOpen] = useState(false);
  const preview = useRef(null);

  useEffect(() => {
    const v = preview.current;
    if (!v) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => (reduce.matches || open ? v.pause() : v.play().catch(() => {}));
    sync();
    reduce.addEventListener?.('change', sync);
    return () => reduce.removeEventListener?.('change', sync);
  }, [open]);

  return (
    <>
      <button type="button" className="about-bento__video" onClick={() => setOpen(true)} aria-label="Дивитися відео про Бавись, 42 секунди, зі звуком">
        <video ref={preview} src={videoPreview} poster={videoPoster} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
        <span className="about-bento__play" aria-hidden="true">
          <Icon name="play" size={30} />
        </span>
      </button>
      {open ? <VideoModal src={videoFull} poster={videoPoster} label="Відео про Бавись" onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export default function About() {
  return (
    <>
      <section className="about-intro">
        <div className="about-intro__bg" aria-hidden="true">
          <Media photo="lawn-strip" alt="" eager />
        </div>
        <PageTitle
          label="Про компанію"
          title="Бавись — це"
          accent="про гру разом"
          br
          text="Ми команда зі Львова, яка вірить, що найкращі свята там, де гості не сидять за столами, а грають, сміються і знайомляться."
        />
        {/* Figma «07 Про нас — 1440»: photo + «16» | video | «70+» + photo; phones: video, then a 2×2 grid */}
        <div className="container about-bento rv" data-reveal="85" style={{ '--rv-delay': '0.4s' }}>
          <div className="about-bento__col">
            <div className="about-bento__photo">
              <Media photo="about-kids-table" />
            </div>
            <div className="about-bento__stat">
              <b>{games.length}</b>
              <span className="about-bento__long">дерев’яних наборів у каталозі: від настільних до великих ігор на газон</span>
              <span className="about-bento__short">дерев’яних наборів у каталозі</span>
            </div>
          </div>
          <AboutVideo />
          <div className="about-bento__col">
            <div className="about-bento__stat">
              <b>{eventsDone}</b>
              <span className="about-bento__long">проведених подій: весілля, корпоративи, фестивалі й сімейні свята</span>
              <span className="about-bento__short">проведених подій</span>
            </div>
            <div className="about-bento__photo">
              <Media photo="about-connect4-kids" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream about-story">
        <div className="container about-story__grid">
          <div className="about-story__logo" aria-hidden="true">
            <Logo />
          </div>
          <div className="about-story__copy">
            <Pill>Наша історія</Pill>
            <Heading as="h2" title="Із любові" accent="до дерев’яних ігор" br className="about-story__title" />
            <p>
              Наша історія розпочалась з кількох великих ігор, які ми робили для свят друзів. Гості не відходили від них до
              ночі, і ми зрозуміли, що це варто робити для всіх.
            </p>
            <p>
              Сьогодні в нашій колекції {games.length} дерев’яних ігор для дорослих і дітей. Ми дбаємо про кожну так, ніби
              вона їде на наше власне свято.
            </p>
            <ul className="about-facts" role="list">
              {facts.map((f) => (
                <li key={f.value}>
                  <strong>{f.value}</strong>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-service">
        <div className="container">
          <Heading as="h2" title="Що входить" accent="в оренду" reveal className="about-service__title" />
          <p className="about-service__text">Ви отримуєте не набір коробок, а готову ігрову зону.</p>
          <ul className="service-tiles" role="list">
            {service.map((s) => (
              <li key={s.text}>
                <span className="service-tiles__icon">
                  <Icon name={s.icon} size={18} />
                </span>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StepsTiles tone="cream" />

      <CtaBanner tone="white" />
    </>
  );
}
