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
import lawnWhite from '../../assets/photos/lawn-white.webp';
// phones: the tower big and centred under the headline (Figma «01 Головна — 390»)
import heroTowerM from '../../assets/photos/hero-tower-m.webp';
// real inventory, arch-shaped crops (see data/inventory.js)
import gMysholovka from '../../assets/photos/games/mysholovka.webp';
import gRybalka from '../../assets/photos/games/rybalka.webp';
import gBalans from '../../assets/photos/games/balans.webp';
import gChotyryVRiad from '../../assets/photos/games/chotyry-v-riad.webp';
import gKornkhol from '../../assets/photos/games/kornkhol.webp';
import gVelykaDzhenga from '../../assets/photos/games/velyka-dzhenga.webp';
import gKiltsekyd from '../../assets/photos/games/kiltsekyd.webp';
import gGalaktyka from '../../assets/photos/games/galaktyka.webp';
import gVOdniVorota from '../../assets/photos/games/v-odni-vorota.webp';
import gShaleniKameni from '../../assets/photos/games/shaleni-kameni.webp';
import gNaHachok from '../../assets/photos/games/na-hachok.webp';
import gVelykyiMorskyiBii from '../../assets/photos/games/velykyi-morskyi-bii.webp';
import gVelykaKytaiskaStina from '../../assets/photos/games/velyka-kytaiska-stina.webp';
import gKiltsekydShchyt from '../../assets/photos/games/kiltsekyd-shchyt.webp';
import gBirponh from '../../assets/photos/games/birponh.webp';
// catalog cards and game pages: the white-backdrop lawn series (4:5, one framing for every game)
import cardVelykaDzhenga from '../../assets/photos/games/card-velyka-dzhenga.webp';
import cardKiltsekyd from '../../assets/photos/games/card-kiltsekyd.webp';
import cardKornkhol from '../../assets/photos/games/card-kornkhol.webp';
import cardChotyryVRiad from '../../assets/photos/games/card-chotyry-v-riad.webp';
import cardGalaktyka from '../../assets/photos/games/card-galaktyka.webp';
import cardBalans from '../../assets/photos/games/card-balans.webp';
import cardRybalka from '../../assets/photos/games/card-rybalka.webp';
import cardMysholovka from '../../assets/photos/games/card-mysholovka.webp';
import cardVOdniVorota from '../../assets/photos/games/card-v-odni-vorota.webp';
import cardShaleniKameni from '../../assets/photos/games/card-shaleni-kameni.webp';
import cardNaHachok from '../../assets/photos/games/card-na-hachok.webp';
import cardVelykyiMorskyiBii from '../../assets/photos/games/card-velykyi-morskyi-bii.webp';
import cardVelykaKytaiskaStina from '../../assets/photos/games/card-velyka-kytaiska-stina.webp';
import cardKulbutto from '../../assets/photos/games/card-kulbutto.webp';
import cardKiltsekydShchyt from '../../assets/photos/games/card-kiltsekyd-shchyt.webp';
import cardBirponh from '../../assets/photos/games/card-birponh.webp';
// game page first screen (Figma 1518:461, 1554×1402)
import heroVelykaDzhenga from '../../assets/photos/games/hero-velyka-dzhenga.webp';
// backgrounds: white backdrop + lawn strip (game hero, about, 404), booking banner, footer
import lawnStrip from '../../assets/photos/lawn-strip.webp';
import ctaLawn from '../../assets/photos/cta-lawn.webp';
import aboutKidsTable from '../../assets/photos/about/kids-table.webp';
import pricesJenga from '../../assets/photos/prices/jenga.webp';
import ydJengaCrowd from '../../assets/photos/blog/youth-day/jenga-crowd.webp';
import ydRybalkaAdults from '../../assets/photos/blog/youth-day/rybalka-adults.webp';
import ydRybalkaKids from '../../assets/photos/blog/youth-day/rybalka-kids.webp';
import pricesBirponh from '../../assets/photos/prices/birponh.webp';
import pricesMorskyiBii from '../../assets/photos/prices/morskyi-bii.webp';
import pricesTable from '../../assets/photos/prices/table.webp';
import pricesTee from '../../assets/photos/prices/tee.webp';
import aboutJengaTower from '../../assets/photos/about/jenga-tower.webp';
import aboutConnect4Kids from '../../assets/photos/about/connect4-kids.webp';
import footerGarden from '../../assets/photos/footer-garden.webp';
import footerGardenM from '../../assets/photos/footer-garden-m.webp';
import jenga404 from '../../assets/photos/jenga-404.webp';
// occasions ("Для яких подій"), 4:3 crops of event photos
import occWedding from '../../assets/photos/occasions/wedding.webp';
import hubCorporate from '../../assets/photos/occasions/hub-corporate.webp';
import hubBirthday from '../../assets/photos/occasions/hub-birthday.webp';
import occCorporate from '../../assets/photos/occasions/corporate.webp';
import occBirthday from '../../assets/photos/occasions/birthday.webp';
import occFestival from '../../assets/photos/occasions/festival.webp';
import occTeambuilding from '../../assets/photos/occasions/teambuilding.webp';
import occFamily from '../../assets/photos/occasions/family.webp';
// home gallery bento (event photos from the Figma file, cropped per tile)
import galJengaGuestsDay from '../../assets/photos/gallery/jenga-guests-day.webp';
import galCornholeEvening from '../../assets/photos/gallery/cornhole-evening.webp';
import galParkConnect4Jenga from '../../assets/photos/gallery/park-connect4-jenga.webp';
import galGuestsTent from '../../assets/photos/gallery/guests-tent.webp';
import galJengaGuestsNight from '../../assets/photos/gallery/jenga-guests-night.webp';
import galGalaktykaEvening from '../../assets/photos/gallery/galaktyka-evening.webp';
import galFestivalTable from '../../assets/photos/gallery/festival-table.webp';
import galVOdniVorotaPlay from '../../assets/photos/gallery/v-odni-vorota-play.webp';
import galConnect4Evening from '../../assets/photos/gallery/connect4-evening.webp';

// real event photos (Figma «Сайт», user's own shots, 2026-10-05)
import evBalansLounge from '../../assets/photos/events/balans-lounge.webp';
import evBalansHands from '../../assets/photos/events/balans-hands.webp';
import evCornholeLake from '../../assets/photos/events/cornhole-lake.webp';
import evJengaHouse from '../../assets/photos/events/jenga-house.webp';
import evBalansTop from '../../assets/photos/events/balans-top.webp';
import evGuestsDog from '../../assets/photos/events/guests-dog.webp';
import evGalaktykaGuests from '../../assets/photos/events/galaktyka-guests.webp';
import evGalaktykaLawn from '../../assets/photos/events/galaktyka-lawn.webp';
import evConnect4Lawn from '../../assets/photos/events/connect4-lawn.webp';
import evConnect4Guests from '../../assets/photos/events/connect4-guests.webp';
import evWeddingGames from '../../assets/photos/events/wedding-games.webp';
import evParkEvent from '../../assets/photos/events/park-event.webp';
import evEventStand from '../../assets/photos/events/event-stand.webp';
import evJengaFestival from '../../assets/photos/events/jenga-festival.webp';
import evKiltsekydRings from '../../assets/photos/events/kiltsekyd-rings.webp';
import evKiltsekydPines from '../../assets/photos/events/kiltsekyd-pines.webp';

export const photos = {
  // home hero: pure white backdrop (#fff) so it melts into the white hero
  'lawn-white': {
    src: lawnWhite,
    mobile: heroTowerM,
    alt: "Вежа великої дерев'яної Дженги на газоні",
  },
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
  // real inventory — hero strip arches
  'game-mysholovka': { src: gMysholovka, alt: 'Гра «Мишоловка»' },
  'game-rybalka': { src: gRybalka, alt: 'Гра «Рибалка»' },
  'game-balans': { src: gBalans, alt: 'Гра «Баланс»' },
  'game-chotyry-v-riad': { src: gChotyryVRiad, alt: 'Гра «4 в ряд»' },
  'game-kornkhol': { src: gKornkhol, alt: 'Гра «Корнхол»' },
  'game-velyka-dzhenga': { src: gVelykaDzhenga, alt: 'Гра «Велика Дженга»' },
  'game-kiltsekyd': { src: gKiltsekyd, alt: 'Гра «Кільцекид»' },
  'game-galaktyka': { src: gGalaktyka, alt: 'Гра «Галактика»' },
  'game-v-odni-vorota': { src: gVOdniVorota, alt: 'Гра «В одні ворота»' },
  'game-shaleni-kameni': { src: gShaleniKameni, alt: 'Гра «Шалені камені»' },
  'game-na-hachok': { src: gNaHachok, alt: 'Гра «На гачок»' },
  'game-velykyi-morskyi-bii': { src: gVelykyiMorskyiBii, alt: 'Гра «Великий морський бій»' },
  'game-velyka-kytaiska-stina': { src: gVelykaKytaiskaStina, alt: 'Гра «Велика китайська стіна»' },
  'game-kiltsekyd-shchyt': { src: gKiltsekydShchyt, alt: 'Гра «Кільцекид щит»' },
  'game-birponh': { src: gBirponh, alt: 'Гра «Бірпонг»' },
  // home gallery bento
  'gal-jenga-guests-day': { src: galJengaGuestsDay, alt: 'Гості грають у Велику Дженгу на святі в саду' },
  'gal-cornhole-evening': { src: galCornholeEvening, alt: 'Корнхол на газоні під вечірніми гірляндами' },
  'gal-park-connect4-jenga': { src: galParkConnect4Jenga, alt: '«4 в ряд» і Велика Дженга на галявині в парку' },
  'gal-guests-tent': { src: galGuestsTent, alt: 'Гості біля шатра на святі' },
  'gal-jenga-guests-night': { src: galJengaGuestsNight, alt: 'Вечірня партія у Велику Дженгу' },
  'gal-galaktyka-evening': { src: galGalaktykaEvening, alt: 'Гра «Галактика» на святі в саду' },
  'gal-festival-table': { src: galFestivalTable, alt: 'Компанія грає за столом на фестивалі' },
  'gal-v-odni-vorota-play': { src: galVOdniVorotaPlay, alt: 'Партія у «В одні ворота»' },
  'gal-connect4-evening': { src: galConnect4Evening, alt: '«4 в ряд» на столі в саду' },
  // catalog cards
  'card-velyka-dzhenga': { src: cardVelykaDzhenga, alt: 'Гра «Велика Дженга»' },
  'card-kiltsekyd': { src: cardKiltsekyd, alt: 'Гра «Кільцекид»' },
  'card-kornkhol': { src: cardKornkhol, alt: 'Гра «Корнхол»' },
  'card-chotyry-v-riad': { src: cardChotyryVRiad, alt: 'Гра «4 в ряд»' },
  'card-galaktyka': { src: cardGalaktyka, alt: 'Гра «Галактика»' },
  'card-balans': { src: cardBalans, alt: 'Гра «Баланс»' },
  'card-rybalka': { src: cardRybalka, alt: 'Гра «Рибалка»' },
  'card-mysholovka': { src: cardMysholovka, alt: 'Гра «Мишоловка»' },
  'card-v-odni-vorota': { src: cardVOdniVorota, alt: 'Гра «В одні ворота»' },
  'card-shaleni-kameni': { src: cardShaleniKameni, alt: 'Гра «Шалені камені»' },
  'card-na-hachok': { src: cardNaHachok, alt: 'Гра «На гачок»' },
  'card-velykyi-morskyi-bii': { src: cardVelykyiMorskyiBii, alt: 'Гра «Великий морський бій»' },
  'card-velyka-kytaiska-stina': { src: cardVelykaKytaiskaStina, alt: 'Гра «Велика китайська стіна»' },
  'card-kulbutto': { src: cardKulbutto, alt: 'Гра «Кульбутто»' },
  'card-kiltsekyd-shchyt': { src: cardKiltsekydShchyt, alt: 'Гра «Кільцекид щит»' },
  'card-birponh': { src: cardBirponh, alt: 'Гра «Бірпонг»' },
  'hero-velyka-dzhenga': { src: heroVelykaDzhenga, alt: 'Гра «Велика Дженга»' },
  // backgrounds
  'lawn-strip': { src: lawnStrip, alt: '' },
  'cta-lawn': { src: ctaLawn, alt: 'Велика Дженга і кільцекид на газоні' },
  'yd-jenga-crowd': { src: ydJengaCrowd, alt: 'Гості навколо Великої Дженги на Дні молоді' },
  'yd-rybalka-adults': { src: ydRybalkaAdults, alt: 'Дорослі й діти грають у «Рибалку» в Стрийському парку' },
  'yd-rybalka-kids': { src: ydRybalkaKids, alt: 'Діти ловлять рибок у «Рибалці» на Дні молоді' },
  'prices-jenga': { src: pricesJenga, alt: 'Велика Дженга на газоні' },
  'prices-birponh': { src: pricesBirponh, alt: 'Стіл для бірпонгу з червоними й синіми стаканчиками' },
  'prices-morskyi-bii': { src: pricesMorskyiBii, alt: 'Великий морський бій: дерев’яний кейс з двома полями' },
  'prices-table': { src: pricesTable, alt: 'Дерев’яний розкладний стіл для ігор' },
  'prices-tee': { src: pricesTee, alt: 'Жовта футболка «Бавись» на траві' },
  'about-kids-table': { src: aboutKidsTable, alt: 'Мама з дитиною грають у «Шалені камені» на святі в парку' },
  'about-jenga-tower': { src: aboutJengaTower, alt: 'Гість обережно витягує брусок з Великої Дженги' },
  'about-connect4-kids': { src: aboutConnect4Kids, alt: 'Діти грають у «4 в ряд» на святі в парку' },
  'footer-garden': { src: footerGarden, mobile: footerGardenM, alt: '' },
  'jenga-404': { src: jenga404, alt: 'Вежа Дженги, з якої випадають бруски', fit: 'contain' },
  // occasions
  'ev-balans-lounge': { src: evBalansLounge, alt: 'Гра «Баланс» на столику в лаунж-зоні свята' },
  'ev-balans-hands': { src: evBalansHands, alt: 'Гравець кладе брусок на «Баланс»' },
  'ev-cornhole-lake': { src: evCornholeLake, alt: 'Корнхол «Бавись» на березі озера' },
  'ev-jenga-house': { src: evJengaHouse, alt: 'Велика Дженга біля дерев’яного будиночка' },
  'ev-balans-top': { src: evBalansTop, alt: '«Баланс» зблизька: бруски на платформі' },
  'ev-guests-dog': { src: evGuestsDog, alt: 'Гості грають у «Баланс» на галявині' },
  'ev-galaktyka-guests': { src: evGalaktykaGuests, alt: 'Гості грають у «Галактику» на святі' },
  'ev-galaktyka-lawn': { src: evGalaktykaLawn, alt: 'Гра «Галактика» на траві' },
  'ev-connect4-lawn': { src: evConnect4Lawn, alt: 'Велика гра «4 в ряд» на газоні' },
  'ev-connect4-guests': { src: evConnect4Guests, alt: 'Дівчата грають у «4 в ряд» на святі' },
  'ev-wedding-games': { src: evWeddingGames, alt: 'Наречені на весільній фотосесії поруч з іграми Бавись' },
  'ev-park-event': { src: evParkEvent, alt: 'Ігрова зона на святі в парку' },
  'ev-event-stand': { src: evEventStand, alt: 'Банер Бавись і «4 в ряд» на події' },
  'ev-jenga-festival': { src: evJengaFestival, alt: 'Велика Дженга «Бавись» на фестивалі' },
  'ev-kiltsekyd-rings': { src: evKiltsekydRings, alt: 'Кільцекид зблизька: мотузкові кільця на кілках' },
  'ev-kiltsekyd-pines': { src: evKiltsekydPines, alt: 'Кільцекид серед сосон на березі' },
  'hub-corporate': { src: hubCorporate, alt: 'Гості грають у Корнхол і Велику Дженгу на галявині' },
  'hub-birthday': { src: hubBirthday, alt: 'Гості й дитина грають у «Галактику»' },
  'occ-wedding': { src: occWedding, alt: 'Гості грають у Велику Дженгу на весіллі' },
  'occ-corporate': { src: occCorporate, alt: 'Гості на корпоративі біля шатра' },
  'occ-birthday': { src: occBirthday, alt: 'Корнхол на вечірньому святі' },
  'occ-festival': { src: occFestival, alt: 'Компанія грає на фестивалі' },
  'occ-teambuilding': { src: occTeambuilding, alt: 'Ігри на галявині для команди' },
  'occ-family': { src: occFamily, alt: 'Вечірня партія у Дженгу з друзями' },
};
