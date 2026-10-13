/**
 * Photos of the event pages (/podii/:slug): the arch portrait of the first screen (`-hero`)
 * and four square gallery shots (`-1` … `-4`). Cropped in Figma «Події · нова структура».
 */
import vesilliaHero from '../../assets/photos/podii/vesillia-hero.webp';
import vesillia1 from '../../assets/photos/podii/vesillia-1.webp';
import vesillia2 from '../../assets/photos/podii/vesillia-2.webp';
import vesillia3 from '../../assets/photos/podii/vesillia-3.webp';
import vesillia4 from '../../assets/photos/podii/vesillia-4.webp';
import korporatyvHero from '../../assets/photos/podii/korporatyv-hero.webp';
import korporatyv1 from '../../assets/photos/podii/korporatyv-1.webp';
import korporatyv2 from '../../assets/photos/podii/korporatyv-2.webp';
import korporatyv3 from '../../assets/photos/podii/korporatyv-3.webp';
import korporatyv4 from '../../assets/photos/podii/korporatyv-4.webp';
import denNarodzhenniaHero from '../../assets/photos/podii/den-narodzhennia-hero.webp';
import denNarodzhennia1 from '../../assets/photos/podii/den-narodzhennia-1.webp';
import denNarodzhennia2 from '../../assets/photos/podii/den-narodzhennia-2.webp';
import denNarodzhennia3 from '../../assets/photos/podii/den-narodzhennia-3.webp';
import denNarodzhennia4 from '../../assets/photos/podii/den-narodzhennia-4.webp';
import festyvalHero from '../../assets/photos/podii/festyval-hero.webp';
import festyval1 from '../../assets/photos/podii/festyval-1.webp';
import festyval2 from '../../assets/photos/podii/festyval-2.webp';
import festyval3 from '../../assets/photos/podii/festyval-3.webp';
import festyval4 from '../../assets/photos/podii/festyval-4.webp';
import timbildynhHero from '../../assets/photos/podii/timbildynh-hero.webp';
import timbildynh1 from '../../assets/photos/podii/timbildynh-1.webp';
import timbildynh2 from '../../assets/photos/podii/timbildynh-2.webp';
import timbildynh3 from '../../assets/photos/podii/timbildynh-3.webp';
import timbildynh4 from '../../assets/photos/podii/timbildynh-4.webp';
import simeiniSviataHero from '../../assets/photos/podii/simeini-sviata-hero.webp';
import simeiniSviata1 from '../../assets/photos/podii/simeini-sviata-1.webp';
import simeiniSviata2 from '../../assets/photos/podii/simeini-sviata-2.webp';
import simeiniSviata3 from '../../assets/photos/podii/simeini-sviata-3.webp';
import simeiniSviata4 from '../../assets/photos/podii/simeini-sviata-4.webp';

const alt = {
  'vesillia': 'на весіллі',
  'korporatyv': 'на корпоративі',
  'den-narodzhennia': 'на дні народження',
  'festyval': 'на фестивалі',
  'timbildynh': 'на тімбілдингу',
  'simeini-sviata': 'на сімейному святі',
};

export const podiiPhotos = {
  'podii-vesillia-hero': { src: vesilliaHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['vesillia']}` },
  'podii-vesillia-1': { src: vesillia1, alt: `Справжня подія з іграми Бавись ${alt['vesillia']}, фото 1` },
  'podii-vesillia-2': { src: vesillia2, alt: `Справжня подія з іграми Бавись ${alt['vesillia']}, фото 2` },
  'podii-vesillia-3': { src: vesillia3, alt: `Справжня подія з іграми Бавись ${alt['vesillia']}, фото 3` },
  'podii-vesillia-4': { src: vesillia4, alt: `Справжня подія з іграми Бавись ${alt['vesillia']}, фото 4` },
  'podii-korporatyv-hero': { src: korporatyvHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['korporatyv']}` },
  'podii-korporatyv-1': { src: korporatyv1, alt: `Справжня подія з іграми Бавись ${alt['korporatyv']}, фото 1` },
  'podii-korporatyv-2': { src: korporatyv2, alt: `Справжня подія з іграми Бавись ${alt['korporatyv']}, фото 2` },
  'podii-korporatyv-3': { src: korporatyv3, alt: `Справжня подія з іграми Бавись ${alt['korporatyv']}, фото 3` },
  'podii-korporatyv-4': { src: korporatyv4, alt: `Справжня подія з іграми Бавись ${alt['korporatyv']}, фото 4` },
  'podii-den-narodzhennia-hero': { src: denNarodzhenniaHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['den-narodzhennia']}` },
  'podii-den-narodzhennia-1': { src: denNarodzhennia1, alt: `Справжня подія з іграми Бавись ${alt['den-narodzhennia']}, фото 1` },
  'podii-den-narodzhennia-2': { src: denNarodzhennia2, alt: `Справжня подія з іграми Бавись ${alt['den-narodzhennia']}, фото 2` },
  'podii-den-narodzhennia-3': { src: denNarodzhennia3, alt: `Справжня подія з іграми Бавись ${alt['den-narodzhennia']}, фото 3` },
  'podii-den-narodzhennia-4': { src: denNarodzhennia4, alt: `Справжня подія з іграми Бавись ${alt['den-narodzhennia']}, фото 4` },
  'podii-festyval-hero': { src: festyvalHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['festyval']}` },
  'podii-festyval-1': { src: festyval1, alt: `Справжня подія з іграми Бавись ${alt['festyval']}, фото 1` },
  'podii-festyval-2': { src: festyval2, alt: `Справжня подія з іграми Бавись ${alt['festyval']}, фото 2` },
  'podii-festyval-3': { src: festyval3, alt: `Справжня подія з іграми Бавись ${alt['festyval']}, фото 3` },
  'podii-festyval-4': { src: festyval4, alt: `Справжня подія з іграми Бавись ${alt['festyval']}, фото 4` },
  'podii-timbildynh-hero': { src: timbildynhHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['timbildynh']}` },
  'podii-timbildynh-1': { src: timbildynh1, alt: `Справжня подія з іграми Бавись ${alt['timbildynh']}, фото 1` },
  'podii-timbildynh-2': { src: timbildynh2, alt: `Справжня подія з іграми Бавись ${alt['timbildynh']}, фото 2` },
  'podii-timbildynh-3': { src: timbildynh3, alt: `Справжня подія з іграми Бавись ${alt['timbildynh']}, фото 3` },
  'podii-timbildynh-4': { src: timbildynh4, alt: `Справжня подія з іграми Бавись ${alt['timbildynh']}, фото 4` },
  'podii-simeini-sviata-hero': { src: simeiniSviataHero, alt: `Гості грають у дерев’яні ігри Бавись ${alt['simeini-sviata']}` },
  'podii-simeini-sviata-1': { src: simeiniSviata1, alt: `Справжня подія з іграми Бавись ${alt['simeini-sviata']}, фото 1` },
  'podii-simeini-sviata-2': { src: simeiniSviata2, alt: `Справжня подія з іграми Бавись ${alt['simeini-sviata']}, фото 2` },
  'podii-simeini-sviata-3': { src: simeiniSviata3, alt: `Справжня подія з іграми Бавись ${alt['simeini-sviata']}, фото 3` },
  'podii-simeini-sviata-4': { src: simeiniSviata4, alt: `Справжня подія з іграми Бавись ${alt['simeini-sviata']}, фото 4` },
};
