/**
 * The real rental inventory — the games that have a «Комплектація гри» sheet
 * in the Figma file «БАВИСЬ UI» (page UI). Order is the order of the home hero
 * strip: the strip is centred, so the middle entries are the ones always seen.
 *
 * Photos are crops of the evening Instagram story shots (the user kept these
 * for the strip). Кульбутто is in the catalog but not in the strip.
 * `slug` matches data/games.js where a catalog page already exists.
 */
export const inventory = [
  { slug: 'mysholovka', name: 'Мишоловка' },
  { slug: 'rybalka', name: 'Рибалка' },
  { slug: 'balans', name: 'Баланс' },
  { slug: 'chotyry-v-riad', name: '4 в ряд' },
  { slug: 'kornkhol', name: 'Корнхол' },
  { slug: 'velyka-dzhenga', name: 'Велика Дженга' },
  { slug: 'kiltsekyd', name: 'Кільцекид' },
  { slug: 'galaktyka', name: 'Галактика' },
  { slug: 'v-odni-vorota', name: 'В одні ворота' },
  { slug: 'shaleni-kameni', name: 'Шалені камені' },
  { slug: 'na-hachok', name: 'На гачок' },
  { slug: 'velykyi-morskyi-bii', name: 'Великий морський бій' },
  { slug: 'velyka-kytaiska-stina', name: 'Велика китайська стіна' },
  { slug: 'kiltsekyd-shchyt', name: 'Кільцекид щит' },
  { slug: 'birponh', name: 'Бірпонг' },
].map((g) => ({ ...g, photo: `game-${g.slug}` }));
