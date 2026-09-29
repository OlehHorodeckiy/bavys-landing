import { games } from '../data/games.js';
import { posts } from '../data/posts.js';
import { gallery } from '../data/gallery.js';
import { eventTypes } from '../data/site.js';
import { Button, Chip, GameMedia, MotifTag, Rule, SectionHead } from '../components/ui.jsx';
import {
  AdvantagesSection,
  CtaBanner,
  GalleryGrid,
  GameGrid,
  GameStrip,
  PageHero,
  PostCard,
  StatsRow,
  StepsSection,
  UseCasesSection,
} from '../components/sections.jsx';

const featured = games.filter((g) => g.featured);
const game = (slug) => games.find((g) => g.slug === slug);

/* Oval strip across the hero: real event photos in the middle, illustrated
   tiles towards the edges until more photography is added. */
const strip = [
  { game: game('kubb') },
  { game: game('chotyry-v-riad') },
  { game: game('kornkhol'), media: { photo: 'cornhole', position: '50% 62%' } },
  { game: game('velyka-dzhenga'), media: { photo: 'lawn-tower', position: '50% 58%' } },
  { game: game('kiltsekyd'), media: { photo: 'ring-toss', position: '50% 70%' } },
  { game: game('kroket') },
  { game: game('khrestyky-nulyky') },
  { game: game('mikado-xl') },
];

function HomeHero() {
  return (
    <PageHero
      size="home"
      align="left"
      media={{ photo: 'event-jenga', position: '68% 50%' }}
      title="Дерев’яні ігри"
      accent="для вашої події"
      text="Оренда великих дерев’яних ігор для весіль, корпоративів і свят у Львові та області. Привеземо, встановимо й покажемо, як грати."
      actions={
        <Button to="/games" variant="light">
          Обрати гру
        </Button>
      }
    >
      <GameStrip items={strip} />
    </PageHero>
  );
}

function Intro() {
  const [a, b, c] = [games[1], games[0], games[2]];
  return (
    <section className="section section--cream intro-section">
      <div className="container">
        <SectionHead
          label="Про Бавись"
          title="Великі ігри,"
          accent="справжні емоції"
          br
          text="Ми збираємо колекцію дерев’яних ігор, у які хочеться грати всім — від дітей до бабусь, від колег до нових родичів. І привозимо їх туди, де ви святкуєте."
        />
        <div className="fan" aria-hidden="true">
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
        <StatsRow />
        <div className="section-actions">
          <Button to="/about">Більше про нас</Button>
        </div>
      </div>
    </section>
  );
}

function GamesPreview() {
  return (
    <section className="section games-preview">
      <div className="container">
        <div className="split-head">
          <SectionHead
            label="Каталог"
            labelTone="cream"
            title="Ігри, які"
            accent="збирають гостей"
            br
            align="left"
            text="Від компактних настільних до гігантських ігор на газон — кожну привеземо підготовленою й чистою."
          />
          <div className="motif-tags">
            {eventTypes.slice(0, 4).map((t) => (
              <MotifTag key={t.id}>{t.label}</MotifTag>
            ))}
          </div>
        </div>
        <GameGrid games={featured} />
        <Rule />
        <div className="section-actions section-actions--split">
          <Button to="/games">Переглянути всі ігри</Button>
          <p className="section-actions__note">
            {games.length} ігор у колекції · нові щосезону
          </p>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section section--cream gallery-preview">
      <div className="container">
        <SectionHead label="Галерея" title="Моменти" accent="з наших подій" br />
      </div>
      <div className="container-wide">
        <GalleryGrid items={gallery} />
      </div>
      <div className="container section-actions">
        <Button to="/gallery">Дивитися галерею</Button>
      </div>
    </section>
  );
}

function BlogPreview() {
  const [first, second, ...rest] = posts;
  return (
    <section className="section blog-preview">
      <div className="container">
        <SectionHead label="Блог" labelTone="cream" title="Історії, поради" accent="та новини" br />
        <div className="post-grid post-grid--rows">
          <PostCard post={first} layout="row" />
          <PostCard post={second} layout="row" />
        </div>
        <div className="post-grid post-grid--cols">
          {rest.slice(0, 3).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <div className="section-actions">
          <Button to="/blog">Читати всі статті</Button>
        </div>
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
      <StepsSection />
      <AdvantagesSection text="Ми не просто здаємо ігри в оренду — ми відповідаємо за те, щоб на вашому святі вони працювали." />
      <UseCasesSection />
      <GalleryPreview />
      <BlogPreview />
      <CtaBanner label="Бронювання" />
    </>
  );
}
