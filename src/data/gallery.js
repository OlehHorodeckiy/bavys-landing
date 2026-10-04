/**
 * Gallery — real photography only. Each item references a photo key from
 * data/media.js; `position` picks the crop.
 *
 * The first five items fill the editorial mosaic (big · tall · two squares ·
 * panorama) in that order; anything after flows on in a regular grid. Until
 * the event photos from Figma are added, the mosaic uses crops of the three
 * existing shots.
 */
export const galleryCategories = [
  { id: 'all', label: 'Усі фото' },
  { id: 'events', label: 'Події' },
  { id: 'games', label: 'Ігри' },
  { id: 'weddings', label: 'Весілля' },
  { id: 'corporate', label: 'Корпоративи' },
  { id: 'outdoor', label: 'Надворі' },
  { id: 'backstage', label: 'Закулісся' },
];

export const gallery = [
  { photo: 'event-jenga', position: '66% 50%', tags: ['events', 'weddings', 'games'], caption: 'Велика Дженга на весільному банкеті' },
  { photo: 'tower', tags: ['games', 'backstage'], caption: 'Вежа перед подією' },
  { photo: 'event-jenga', position: '30% 0%', tags: ['events', 'weddings'], caption: 'Гірлянди й вечірнє світло' },
  { photo: 'event-jenga', position: '100% 100%', tags: ['events', 'games', 'corporate'], caption: 'Момент, коли вежа падає' },
  { photo: 'lawn-tower', position: '50% 62%', tags: ['outdoor', 'games', 'corporate'], caption: 'Ігрова зона просто неба' },
];

/**
 * Real event photos — the Calmlyss-style bento (5 columns × 3 rows, full
 * bleed) on the home page and the gallery page; `tags` drive the gallery chips. Order = tile order: tall, square, panorama, wide, tall, square,
 * wide, square, square. Each photo is pre-cropped to its tile.
 */
export const homeGallery = [
  { photo: 'gal-jenga-guests-day', tags: ['events', 'games', 'outdoor'] },
  { photo: 'gal-cornhole-evening', tags: ['games', 'outdoor', 'weddings'] },
  { photo: 'gal-park-connect4-jenga', tags: ['games', 'outdoor'] },
  { photo: 'gal-guests-tent', tags: ['events', 'corporate', 'outdoor'] },
  { photo: 'gal-jenga-guests-night', tags: ['events', 'weddings', 'games'] },
  { photo: 'gal-galaktyka-evening', tags: ['games', 'outdoor'] },
  { photo: 'gal-festival-table', tags: ['events', 'corporate'] },
  { photo: 'gal-v-odni-vorota-play', tags: ['games', 'corporate'] },
  { photo: 'gal-connect4-evening', tags: ['games', 'outdoor'] },
];
