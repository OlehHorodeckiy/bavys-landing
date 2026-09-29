import { useEffect } from 'react';
import { useRoute } from './router.js';
import { findGame } from './data/games.js';
import { findPost } from './data/posts.js';
import Header, { MobileBar } from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Games from './pages/Games.jsx';
import Game from './pages/Game.jsx';
import Gallery from './pages/Gallery.jsx';
import Blog from './pages/Blog.jsx';
import Article from './pages/Article.jsx';
import About from './pages/About.jsx';
import Contacts from './pages/Contacts.jsx';
import NotFound from './pages/NotFound.jsx';

const TITLE = 'Бавись — оренда дерев’яних ігор у Львові';

function resolve({ segments, query }) {
  const [section, slug] = segments;
  if (!section) return { page: <Home />, title: TITLE };
  if (section === 'games' && slug) return { page: <Game slug={slug} />, title: `${findGame(slug)?.name ?? 'Гра'} — Бавись` };
  if (section === 'games') return { page: <Games query={query} />, title: 'Каталог ігор — Бавись' };
  if (section === 'gallery') return { page: <Gallery />, title: 'Галерея — Бавись' };
  if (section === 'blog' && slug) return { page: <Article slug={slug} />, title: `${findPost(slug)?.title ?? 'Стаття'} — Бавись` };
  if (section === 'blog') return { page: <Blog />, title: 'Блог — Бавись' };
  if (section === 'about') return { page: <About />, title: 'Про компанію — Бавись' };
  if (section === 'contacts') return { page: <Contacts query={query} />, title: 'Контакти й бронювання — Бавись' };
  return { page: <NotFound />, title: 'Сторінку не знайдено — Бавись' };
}

export default function App() {
  const route = useRoute();
  const { page, title } = resolve(route);
  const [section, slug] = route.segments;
  // Booking CTAs on a game page carry that game into the request form.
  const bookQuery = section === 'games' && findGame(slug) ? { game: slug } : undefined;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Перейти до змісту
      </a>
      <Header path={route.path} bookQuery={bookQuery} />
      <main id="main" tabIndex={-1} key={route.path + JSON.stringify(route.query)}>
        {page}
      </main>
      <Footer />
      <MobileBar path={route.path} bookQuery={bookQuery} />
    </>
  );
}
