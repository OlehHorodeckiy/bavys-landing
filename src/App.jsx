import { useEffect } from 'react';
import { useRoute } from './router.js';
import { trackPage } from './analytics.js';
import { findGame } from './data/games.js';
import { findPost } from './data/posts.js';
import Header, { MobileBar } from './components/Header.jsx';
import { useScrollReveal } from './components/motion.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/BookingModal.jsx';
import Home from './pages/Home.jsx';
import Games from './pages/Games.jsx';
import Game from './pages/Game.jsx';
import Gallery from './pages/Gallery.jsx';
import Blog from './pages/Blog.jsx';
import Article from './pages/Article.jsx';
import About from './pages/About.jsx';
import Contacts from './pages/Contacts.jsx';
import NotFound from './pages/NotFound.jsx';
import Lab from './pages/Lab.jsx';

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
  if (section === 'contacts') return { page: <Contacts />, title: 'Контакти й бронювання — Бавись' };
  return { page: <NotFound />, title: 'Сторінку не знайдено — Бавись' };
}

export default function App() {
  const route = useRoute();
  const { page, title } = resolve(route);
  const [section, slug] = route.segments;
  // Booking buttons on a game page quietly add that game to the request.
  const bookGame = section === 'games' && findGame(slug) ? slug : true;
  const pageKey = route.path + JSON.stringify(route.query);
  useScrollReveal(pageKey);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    trackPage(route.path, title);
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // design lab (dev server only): bare page, no header or footer
  if (import.meta.env.DEV && section === 'lab') return <Lab slug={slug} />;

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Перейти до змісту
      </a>
      <Header path={route.path} book={bookGame} />
      <main id="main" tabIndex={-1} key={pageKey}>
        {page}
      </main>
      <Footer />
      <MobileBar path={route.path} book={bookGame} />
      <BookingModal />
    </>
  );
}
