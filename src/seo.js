/**
 * What search engines and link previews see for every page: title, description,
 * share image and structured data (schema.org JSON-LD). Used by the prerender
 * (scripts/prerender.mjs writes it into each page's <head>) and by App.jsx,
 * which keeps the title and description in step while you browse.
 *
 * SITE_URL is the public address (VITE_SITE_URL in .env.production). Canonical
 * links, absolute share images and sitemap.xml need it; without it they are left out.
 */
import { company } from './data/site.js';
import { findGame, gamePrice, games, placeLabel, rental } from './data/games.js';
import { findPost, posts } from './data/posts.js';
import { photos } from './data/media.js';
import { faq } from './data/faq.js';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
const BRAND = 'Бавись';
const abs = (p) => (SITE_URL ? SITE_URL + p : p);
const img = (key) => (photos[key] ? photos[key].src : undefined);

/** Every page that exists, for the prerender and the sitemap. */
export const allRoutes = () => [
  '/',
  '/games',
  ...games.map((g) => `/games/${g.slug}`),
  '/prices',
  '/gallery',
  '/blog',
  ...posts.map((p) => `/blog/${p.slug}`),
  '/about',
  '/contacts',
];

/** «Велика Дженга … азарт! Ідеальна…» → at most ~160 characters, cut on a word. */
const clip = (s, n = 160) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n - 1))}…`);

const MONTHS = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
/** «18 вересня 2026» → 2026-09-18 */
const isoDate = (s) => {
  const [d, m, y] = s.split(' ');
  const mi = MONTHS.indexOf(m);
  return mi < 0 ? undefined : `${y}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

const business = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': abs('/#business'),
  name: BRAND,
  description: 'Оренда великих дерев’яних ігор для весіль, корпоративів, фестивалів і сімейних свят у Львові та області.',
  url: abs('/'),
  telephone: company.phone.replace(/[^\d+]/g, ''),
  email: company.email,
  image: abs(img('lawn-white') || ''),
  priceRange: `від ${rental.price}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Львів', addressRegion: 'Львівська область', addressCountry: 'UA' },
  areaServed: [{ '@type': 'City', name: 'Львів' }, { '@type': 'AdministrativeArea', name: 'Львівська область' }],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '10:00', closes: '18:00' },
  ],
  sameAs: company.socials.filter((s) => s.id === 'instagram').map((s) => s.href.split('?')[0]),
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

/**
 * Meta for a route path: { title, description, image, jsonLd[], noindex, path }.
 * Titles: «Що це · у Львові | Бавись»; descriptions say what, where and for how much.
 */
export function pageMeta(path) {
  const [section, slug] = path.split('/').filter(Boolean);
  const base = { path, image: img('lawn-white'), jsonLd: [business], noindex: false };

  if (!section) {
    return {
      ...base,
      jsonLd: [business, faqPage],
      title: 'Оренда великих дерев’яних ігор у Львові | Бавись',
      description: `Велика Дженга, корнхол, кільцекид та ще ${games.length - 3} дерев’яних ігор в оренду на весілля, корпоративи й дні народження. Доставка по Львову та області, від ${rental.price}.`,
    };
  }

  if (section === 'games' && slug) {
    const g = findGame(slug);
    if (!g) return notFound(path);
    const description = clip(`${g.lead} Оренда ${g.name} у Львові: ${gamePrice(g)}, ${g.players} гравців, ${placeLabel[g.place].toLowerCase()}. Доставка по Львову та області.`);
    return {
      ...base,
      title: `${g.name}: оренда гри у Львові | Бавись`,
      description,
      image: img(g.hero || g.photo),
      jsonLd: [
        business,
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: g.name,
          description: g.lead,
          image: abs(img(g.photo) || ''),
          brand: { '@type': 'Brand', name: BRAND },
          offers: {
            '@type': 'Offer',
            url: abs(path),
            price: String(parseInt(gamePrice(g), 10)),
            priceCurrency: 'UAH',
            availability: 'https://schema.org/InStock',
            priceSpecification: { '@type': 'UnitPriceSpecification', price: String(parseInt(gamePrice(g), 10)), priceCurrency: 'UAH', unitText: 'доба' },
            seller: { '@id': abs('/#business') },
          },
        },
        faqPage,
        crumbs([[BRAND, '/'], ['Ігри', '/games'], [g.name, path]]),
      ],
    };
  }

  if (section === 'games') {
    return {
      ...base,
      title: 'Каталог дерев’яних ігор в оренду у Львові | Бавись',
      description: `${games.length} великих дерев’яних ігор для свят: Дженга, корнхол, 4 в ряд, Галактика, бірпонг та інші. Оренда від ${rental.price}, доставка по Львову та області.`,
      image: img('card-velyka-dzhenga'),
      jsonLd: [
        business,
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: games.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.name, url: abs(`/games/${g.slug}`) })),
        },
      ],
    };
  }

  if (section === 'prices') {
    return {
      ...base,
      title: 'Ціни на оренду дерев’яних ігор у Львові | Бавись',
      description: `Оренда гри від ${rental.price}: ${rental.bundle}. Велика Дженга, Бірпонг і Великий морський бій мають свою ціну. Інструктор ${rental.instructor}.`,
      image: img('ev-jenga-festival'),
      jsonLd: [business, faqPage, crumbs([[BRAND, '/'], ['Ціни', '/prices']])],
    };
  }

  if (section === 'gallery') {
    return {
      ...base,
      title: 'Фото з наших свят: дерев’яні ігри на подіях у Львові | Бавись',
      description: 'Як виглядають наші дерев’яні ігри на весіллях, корпоративах і фестивалях у Львові: живі фото гостей та ігрових зон.',
      image: img('ev-jenga-festival'),
    };
  }

  if (section === 'blog' && slug) {
    const p = findPost(slug);
    if (!p) return notFound(path);
    return {
      ...base,
      title: `${p.title} | Бавись`,
      description: clip(`${p.excerpt} ${p.lead}`),
      image: img(p.media?.photo),
      jsonLd: [
        business,
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          image: abs(img(p.media?.photo) || ''),
          datePublished: isoDate(p.date),
          inLanguage: 'uk',
          author: { '@type': 'Organization', name: BRAND },
          publisher: { '@id': abs('/#business') },
          mainEntityOfPage: abs(path),
        },
        crumbs([[BRAND, '/'], ['Блог', '/blog'], [p.title, path]]),
      ],
    };
  }

  if (section === 'blog') {
    return {
      ...base,
      title: 'Блог про ігри та свята | Бавись',
      description: 'Поради, як обрати ігри для весілля чи корпоративу, історії наших подій у Львові й новини Бавись.',
      image: img(posts[0]?.media?.photo),
    };
  }

  if (section === 'about') {
    return {
      ...base,
      title: 'Про Бавись: оренда дерев’яних ігор у Львові',
      description: `Команда зі Львова, яка привозить великі дерев’яні ігри на свята: ${games.length} ігор, доставка, встановлення й інструктор на події. Оренда від ${rental.price}.`,
    };
  }

  if (section === 'contacts') {
    return {
      ...base,
      title: 'Контакти й бронювання ігор | Бавись',
      description: `Залиште заявку на оренду ігор або зателефонуйте: ${company.phone}. Працюємо щодня, доставляємо по Львову та області.`,
    };
  }

  return notFound(path);
}

function notFound(path) {
  return {
    path,
    title: 'Сторінку не знайдено | Бавись',
    description: 'Такої сторінки немає. Перегляньте каталог дерев’яних ігор Бавись.',
    image: img('lawn-white'),
    jsonLd: [],
    noindex: true,
  };
}
