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
 * Real event photos (the owner's own shots) — the Calmlyss-style bento on the home
 * page and the gallery page. Order = tile order at 1440: tall, square, panorama,
 * wide, tall, square, wide, square, square; `position` keeps games and people in
 * each crop. `tags` drive the gallery chips (only tags we know for sure).
 */
export const homeGallery = [
  { photo: 'ev-jenga-festival', position: '50% 40%', tags: ['events', 'games', 'outdoor'] },
  { photo: 'ev-connect4-guests', position: '50% 62%', tags: ['events', 'games', 'outdoor'] },
  { photo: 'ev-park-event', position: '50% 66%', tags: ['events', 'outdoor'] },
  { photo: 'ev-wedding-games', position: '50% 58%', tags: ['weddings', 'events', 'outdoor'] },
  { photo: 'ev-galaktyka-guests', position: '40% 50%', tags: ['events', 'games'] },
  { photo: 'ev-cornhole-lake', position: '50% 62%', tags: ['games', 'outdoor'] },
  { photo: 'ev-guests-dog', position: '50% 55%', tags: ['events', 'games', 'outdoor'] },
  { photo: 'ev-jenga-house', position: '50% 65%', tags: ['games', 'events'] },
  { photo: 'ev-kiltsekyd-rings', position: '50% 50%', tags: ['games', 'outdoor'] },
];

/**
 * The gallery page: a second bento under the first, same columns and rows.
 * Tile order at 1440: tall, wide, square, tall, square, square, square.
 */
export const galleryMore = [
  { photo: 'ev-balans-lounge', position: '50% 60%', tags: ['games', 'events', 'outdoor'] },
  { photo: 'ev-connect4-lawn', position: '50% 50%', tags: ['games', 'outdoor'] },
  { photo: 'ev-galaktyka-lawn', position: '50% 55%', tags: ['games', 'outdoor'] },
  { photo: 'ev-balans-hands', position: '50% 50%', tags: ['games'] },
  { photo: 'ev-event-stand', position: '50% 55%', tags: ['events', 'backstage', 'outdoor'] },
  { photo: 'ev-kiltsekyd-pines', position: '50% 70%', tags: ['games', 'outdoor', 'backstage'] },
  { photo: 'ev-balans-top', position: '50% 50%', tags: ['games', 'backstage'] },
];

export const allGalleryPhotos = [...homeGallery, ...galleryMore];
