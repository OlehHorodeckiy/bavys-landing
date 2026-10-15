import { guides } from './guides.js';

/**
 * Blog — the company's story: events, partners, company news, games and tips.
 * «День молоді у Стрийському парку» is a real story (facts from the owner, photos
 * from the event); the rest are the long guides in data/guides.js. The old demo posts were
 * removed on 2026-10-14; their addresses redirect (see OLD_POSTS in scripts/prerender.mjs).
 */
export const blogCategories = [
  { id: 'all', label: 'Усі статті' },
  { id: 'events', label: 'Події' },
  { id: 'partners', label: 'Партнери' },
  { id: 'company', label: 'Компанія' },
  { id: 'games', label: 'Ігри' },
  { id: 'tips', label: 'Поради' },
];

export const blogCategory = (id) => blogCategories.find((c) => c.id === id);

export const posts = [
  ...guides,
  {
    slug: 'den-molodi-stryiskyi-park',
    category: 'partners',
    title: 'День молоді у Стрийському парку: «Бавись» серед партнерів свята',
    excerpt: '15–16 серпня ми долучилися до святкування Дня молоді у Стрийському парку, організованого Львівською міською радою, і облаштували для гостей ігрову зону.',
    date: '6 жовтня 2026',
    read: '3 хв',
    media: { photo: 'about-jenga-tower' },
    figure: { photo: 'about-connect4-kids', caption: '«4 в ряд» на Дні молоді у Стрийському парку' },
    lead: '15–16 серпня Львівська міська рада провела у Стрийському парку святкування Дня молоді. «Бавись» долучився до події як партнер і облаштував для відвідувачів ігрову зону з великих дерев’яних ігор.',
    sections: [
      { title: 'Формат участі', text: 'Ми привезли в парк сім ігор: Велику Дженгу, кільцекид, «Рибалку», «4 в ряд», «Шалені камені» з магнітами, «В одні ворота» та «Мишоловку». Ігрова зона працювала просто неба й була відкрита для всіх гостей свята.' },
      { title: 'Аудиторія', text: 'Свято зібрало багато відвідувачів, і ігри однаково зацікавили дітей і дорослих. Наймолодші змагалися в «4 в ряд» і «Рибалку», старші гості збиралися навколо Великої Дженги.' },
      { title: 'Супровід на майданчику', text: 'На ігровій зоні працював інструктор «Бавись»: пояснював правила, допомагав гостям розпочати гру й стежив за порядком на майданчику.' },
      { title: 'Подяка і співпраця', text: 'Дякуємо Львівській міській раді за запрошення та довіру, а гостям свята за активну участь. Ми відкриті до співпраці з організаторами міських подій, фестивалів і корпоративних заходів і підберемо ігри під формат та кількість гостей.' },
    ],
    quote: 'Великі дерев’яні ігри об’єднують гостей будь-якого віку, і День молоді це ще раз підтвердив.',
    gallery: ['about-kids-table', 'yd-rybalka-adults', 'yd-jenga-crowd', 'yd-rybalka-kids'],
    relatedGames: ['velyka-dzhenga', 'kiltsekyd', 'rybalka', 'chotyry-v-riad', 'shaleni-kameni', 'v-odni-vorota', 'mysholovka'],
  },
];

export const findPost = (slug) => posts.find((p) => p.slug === slug);
