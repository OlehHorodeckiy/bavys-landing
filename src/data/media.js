/**
 * Every real photograph the site uses, in one place.
 *
 * To add photos from the Figma file: export them into `assets/photos/`, import
 * them here and give them a key. Anything that references a key (games, gallery,
 * blog) picks the new photo up automatically. Games without a photo fall back to
 * their illustrated tile (see components/GameArt.jsx).
 */
import eventJenga from '../../assets/photos/event-jenga.webp';
import lawnTower from '../../assets/photos/lawn-tower.webp';
import tower from '../../assets/photos/jenga-tower.webp';

export const photos = {
  'event-jenga': {
    src: eventJenga,
    alt: "Велика дерев'яна Дженга на весільному столі під гірляндами",
  },
  'lawn-tower': {
    src: lawnTower,
    alt: "Вежа великої Дженги на газоні",
    // top of the image is transparent — sits on a sky-toned backdrop
    backdrop: 'sky',
  },
  tower: {
    src: tower,
    alt: "Вежа з дерев'яних брусків великої Дженги",
    // cut-out product shot — shown on a warm studio backdrop
    backdrop: 'studio',
    fit: 'contain',
  },
};
