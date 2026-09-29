/**
 * Company details, navigation and the shared event taxonomy.
 * Phone, e-mail and social links are carried over from the previous landing page
 * and still need their real values.
 */
export const company = {
  name: 'Бавись',
  city: 'Львів',
  region: 'Львів та область',
  phone: '+38 (000) 000-00-00',
  phoneHref: 'tel:+380000000000',
  email: 'hello@bavys.lviv.ua',
  hours: [
    { label: 'Пн — Пт', value: '09:00 — 20:00' },
    { label: 'Сб — Нд', value: '10:00 — 18:00' },
  ],
  address: 'Львів',
  addressNote: 'Склад і видача ігор — за попереднім записом. Доставляємо по Львову та області.',
  socials: [
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/' },
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/' },
  ],
};

export const nav = [
  { path: '/', label: 'Головна' },
  { path: '/games', label: 'Ігри' },
  { path: '/gallery', label: 'Галерея' },
  { path: '/blog', label: 'Блог' },
  { path: '/about', label: 'Про нас' },
  { path: '/contacts', label: 'Контакти' },
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
export const useCases = [
  {
    id: 'wedding',
    title: 'Весілля',
    note: 'Зона відпочинку для гостей між тостами',
    media: { photo: 'event-jenga', position: '72% 50%' },
  },
  {
    id: 'corporate',
    title: 'Корпоративи',
    note: 'Командні ігри на 20–300 гостей',
    media: { photo: 'tower' },
  },
  {
    id: 'birthday',
    title: 'Дні народження',
    note: 'Для дітей і дорослих в одному просторі',
    media: { art: 'kids' },
  },
  {
    id: 'festival',
    title: 'Фестивалі',
    note: 'Ігрові острівці, що збирають натовп',
    media: { photo: 'lawn-tower', position: '50% 70%' },
  },
  {
    id: 'teambuilding',
    title: 'Тімбілдинг',
    note: 'Стратегія, азарт і спільна перемога',
    media: { art: 'kubb' },
  },
  {
    id: 'family',
    title: 'Сімейні свята',
    note: 'Ігри, у які грають усі покоління',
    media: { art: 'croquet' },
  },
];

/** Headline numbers. Carried over from the previous landing page — confirm before launch. */
export const stats = [
  { value: '32', suffix: '', title: "Дерев'яні", accent: 'набори', text: 'Ігри для дорослих, дітей і змішаних компаній — від настільних до гігантських.' },
  { value: '120', suffix: '+', title: 'Проведених', accent: 'подій', text: 'Весілля, корпоративи, фестивалі та сімейні свята у Львові й області.' },
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
    title: 'Привозимо й',
    accent: 'встановлюємо',
    text: 'Доставляємо, розставляємо, пояснюємо правила і забираємо після свята.',
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
