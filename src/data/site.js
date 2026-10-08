/**
 * Company details, navigation and the shared event taxonomy.
 * Phone, e-mail and Instagram are real. Telegram / Facebook were removed until the
 * company has them: add them back to `socials` and they appear in the footer and on contacts.
 */
export const company = {
  name: 'Бавись',
  city: 'Львів',
  region: 'Львів та область',
  phone: '+38 (063) 993-16-76',
  phoneHref: 'tel:+380639931676',
  email: 'solomiya.maksymovych@gmail.com',
  /** inbox that receives the booking requests (not shown on the site) */
  leadsEmail: 'solomiya.maksymovych@gmail.com',
  hours: [
    { label: 'Пн — Пт', value: '09:00 — 20:00' },
    { label: 'Сб — Нд', value: '10:00 — 18:00' },
  ],
  address: 'Львів',
  addressNote: 'Склад і видача ігор — за попереднім записом. Доставляємо по Львову та області.',
  socials: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/bavys.lviv?stkn=MWFzN2VhMXcwY2Q3YQ%3D%3D' },
  ],
};

/** `footer: false` — in the header and the phone menu only (the footer list stays as in Figma). */
// `icon`: shown in the header capsule on hover and on the current page;
// `header: false`: footer only (the logo already leads home)
export const nav = [
  { path: '/', label: 'Головна', icon: 'navHome', header: false },
  { path: '/games', label: 'Ігри', icon: 'navGames' },
  { path: '/podii', label: 'Події', icon: 'navEvents' },
  { path: '/prices', label: 'Ціни', icon: 'navPrices', footer: false },
  { path: '/gallery', label: 'Галерея', icon: 'navGallery' },
  { path: '/blog', label: 'Блог', icon: 'navBlog' },
  { path: '/about', label: 'Про нас', icon: 'navAbout' },
  { path: '/contacts', label: 'Контакти', icon: 'navPhone' },
];

/** Event types — used for game tags, catalog filters and the booking form. */
export const eventTypes = [
  { id: 'wedding', label: 'Весілля', dot: '#C78460' },
  { id: 'corporate', label: 'Корпоратив', dot: '#5E2400' },
  { id: 'birthday', label: 'День народження', dot: '#D9A441' },
  { id: 'festival', label: 'Фестиваль', dot: '#B5562B' },
  { id: 'family', label: 'Сімейне свято', dot: '#96672A' },
  { id: 'teambuilding', label: 'Тімбілдинг', dot: '#6B584E' },
  { id: 'kids', label: 'Дитяче свято', dot: '#E0A15E' },
  { id: 'outdoor', label: 'Надворі', dot: '#4F7D00' },
];

export const eventType = (id) => eventTypes.find((e) => e.id === id);

/** Catalog filters, in the order the brief lists them. */
export const gameFilters = [
  { id: 'all', label: 'Усі ігри' },
  { id: 'corporate', label: 'Корпоративи' },
  { id: 'wedding', label: 'Весілля' },
  { id: 'birthday', label: 'Дні народження' },
  { id: 'festival', label: 'Фестивалі' },
  { id: 'family', label: 'Сімейні' },
  { id: 'outdoor', label: 'Надворі' },
  { id: 'kids', label: 'Для дітей' },
];

/** Where the games are used — the "Events" section. */
/**
 * Photos for the «Події» page cards (Figma «13 Події»): real event photos, framed
 * like the Figma crops (`position` = where the 4:3 window sits on a tall photo).
 */
export const eventPhotos = {
  wedding: { photo: 'ev-wedding-games', position: '50% 64%' },
  corporate: { photo: 'hub-corporate', position: '50% 66%' },
  birthday: { photo: 'hub-birthday', position: '50% 78%' },
  festival: { photo: 'ev-jenga-festival' },
  teambuilding: { photo: 'yd-rybalka-adults' },
  family: { photo: 'ev-balans-lounge', position: '50% 76%' },
};

export const useCases = [
  {
    id: 'wedding',
    photo: 'occ-wedding',
    title: 'Весілля',
    note: 'Зона відпочинку для гостей між тостами',
  },
  {
    id: 'corporate',
    photo: 'occ-corporate',
    title: 'Корпоративи',
    note: 'Командні ігри на 20–300 гостей',
  },
  {
    id: 'birthday',
    photo: 'occ-birthday',
    title: 'Дні народження',
    note: 'Для дітей і дорослих в одному просторі',
  },
  {
    id: 'festival',
    photo: 'occ-festival',
    title: 'Фестивалі',
    note: 'Ігрові острівці, що збирають натовп',
  },
  {
    id: 'teambuilding',
    photo: 'occ-teambuilding',
    title: 'Тімбілдинг',
    note: 'Стратегія, азарт і спільна перемога',
  },
  {
    id: 'family',
    photo: 'occ-family',
    title: 'Сімейні свята',
    note: 'Ігри, у які грають усі покоління',
  },
];

/** Headline numbers (confirmed by the owner 2026-10-04: 16 games, about 70 events). */
export const stats = [
  { value: '16', suffix: '', title: "Дерев'яні", accent: 'набори', text: 'Ігри для дорослих, дітей і змішаних компаній — від настільних до гігантських.' },
  { value: '70', suffix: '+', title: 'Проведених', accent: 'подій', text: 'Весілля, корпоративи, фестивалі та сімейні свята у Львові й області.' },
  { value: '24', suffix: 'год', title: 'Швидке', accent: 'бронювання', text: 'Підтверджуємо наявність і деталі протягом доби після заявки.' },
];

export const steps = [
  {
    no: '01',
    title: 'Оберіть',
    accent: 'ігри',
    text: 'Перегляньте каталог і додайте ігри, що пасують вашій події.',
    meta: '5 хв',
    cta: { label: 'До каталогу', path: '/games' },
  },
  {
    no: '02',
    title: 'Надішліть',
    accent: 'заявку',
    text: 'Вкажіть дату, локацію та кількість гостей — без передоплати.',
    meta: '2 хв',
    cta: { label: 'Заявка', path: '/contacts' },
  },
  {
    no: '03',
    title: 'Підтверджуємо',
    accent: 'наявність',
    text: 'Адміністратор зателефонує, уточнить деталі й зафіксує бронь.',
    meta: 'до 24 год',
    cta: { label: 'Контакти', path: '/contacts' },
  },
  {
    no: '04',
    title: 'Привозимо',
    accent: 'на локацію',
    text: 'Розставляємо ігри, пояснюємо правила й забираємо після свята.',
    meta: 'у день події',
    cta: { label: 'Про сервіс', path: '/about' },
  },
];

export const advantages = [
  { icon: 'blocks', title: 'Велика', accent: 'колекція', text: "Десятки дерев'яних ігор — для камерної вечірки й для фестивалю на тисячу гостей." },
  { icon: 'sparkle', title: 'Професійна', accent: 'підготовка', text: 'Кожна гра після події проходить огляд, шліфування та чистку.' },
  { icon: 'truck', title: 'Доставка та', accent: 'монтаж', text: 'Привозимо, встановлюємо і забираємо. Вам лишається тільки грати.' },
  { icon: 'calendar', title: 'Під будь-яку', accent: 'подію', text: 'Підбираємо набір під формат, вік гостей, локацію та погоду.' },
  { icon: 'star', title: 'Реальний', accent: 'досвід', text: 'Сотні свят за плечима — знаємо, що працює і як розставити зону.' },
  { icon: 'chat', title: 'Адміністратор', accent: 'на звʼязку', text: 'Одна людина веде вашу заявку від першого дзвінка до завершення події.' },
];
