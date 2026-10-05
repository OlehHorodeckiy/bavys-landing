import { useEffect } from 'react';
import { useRoute } from './router.js';
import { trackPage } from './analytics.js';
import { pageMeta } from './seo.js';
import { findGame } from './data/games.js';
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
import Prices from './pages/Prices.jsx';
import NotFound from './pages/NotFound.jsx';
import Lab from './pages/Lab.jsx';

function resolve({ segments, query }) {
  const [section, slug] = segments;
  if (!section) return <Home />;
  if (section === 'games' && slug) return <Game slug={slug} />;
  if (section === 'games') return <Games query={query} />;
  if (section === 'prices') return <Prices />;
  if (section === 'gallery') return <Gallery />;
  if (section === 'blog' && slug) return <Article slug={slug} />;
  if (section === 'blog') return <Blog />;
  if (section === 'about') return <About />;
  if (section === 'contacts') return <Contacts />;
  return <NotFound />;
}

/** Keep <head> in step while browsing (the prerendered HTML already has it for the first page). */
function setHead({ title, description, noindex }) {
  document.title = title;
  const set = (sel, attr, value) => {
    const el = document.head.querySelector(sel);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', description);
  set('meta[property="og:title"]', 'content', title);
  set('meta[property="og:description"]', 'content', description);
  set('meta[name="robots"]', 'content', noindex ? 'noindex' : 'index, follow');
}

export default function App() {
  const route = useRoute();
  const page = resolve(route);
  const meta = pageMeta(route.path);
  const { title } = meta;
  const [section, slug] = route.segments;
  // Booking buttons on a game page quietly add that game to the request.
  const bookGame = section === 'games' && findGame(slug) ? slug : true;
  const pageKey = route.path + JSON.stringify(route.query);
  useScrollReveal(pageKey);

  useEffect(() => {
    setHead(meta);
  }, [route.path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    trackPage(title);
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
