# Бавись: оренда дерев’яних ігор у Львові

Сайт компанії на дизайн-системі референсу
[Calmlyss (Yoga Wellness Studio)](https://dribbble.com/shots/27385676-Calmlyss-Yoga-Wellness-Studio-Website-Template):
та сама логіка сторінок, сітки, карток, кнопок і ритму секцій, але свій контент про оренду ігор для подій.
Дизайн живе у Фігмі «БАВИСЬ UI» (сторінка «Сайт»: секції «Бавись — сайт» 1440 і «Бавись — мобілка» 390).

React 19 + Vite. Шрифт лише **Comfortaa** (300 для акцентних слів заголовків, 500 для тексту, 700 для заголовків і кнопок).

**Сайт:** https://bavyslviv.com.ua (Cloudflare)

## Запуск

```bash
npm install
npm run dev -- --port 5174   # http://127.0.0.1:5174
npm run build                # збірка + готовий HTML кожної сторінки у dist/
npm run preview              # dist/ так, як його віддає Cloudflare Pages: http://127.0.0.1:4173
```

Адреси звичайні: `/games/velyka-dzhenga`, `/blog/…`, `/contacts`. Під час збирання
`scripts/prerender.mjs` малює кожну сторінку в окремий HTML (`dist/games/velyka-dzhenga.html`) з її текстом,
заголовком, описом і розміткою schema.org, тож Google бачить усі сторінки окремо. У браузері React
підхоплює цей HTML і далі перемикає сторінки без перезавантаження (`src/router.js`).
Старі посилання виду `/#/games/kornkhol` автоматично ведуть на нові адреси.

## Сторінки

| Адреса | Сторінка |
|---|---|
| `/` | Головна: hero з вежею і стрічкою арок · про нас + цифри · ігри · як замовити · для яких подій · галерея з банером |
| `/games` | Каталог з чипами подій (на телефоні перші 8 ігор і «Показати ще ігри») |
| `/games/:slug` | Сторінка гри: перший екран з фото й фактами · що це за гра + правила · деталі · банер · інші ігри |
| `/gallery` | Галерея з чипами |
| `/blog`, `/blog/:slug` | Блог і стаття |
| `/about` | Про компанію |
| `/contacts` | Контакти + форма заявки |

Кожна сторінка має версію 1440 і мобільну 390 (стилі для телефонів зібрані в `src/styles/mobile.css`).
Кнопки «Забронювати» по всьому сайту відкривають попап із формою (на телефоні це шторка знизу).

## Структура

```
src/
  data/        контент: games.js, posts.js, gallery.js, site.js (контакти, навігація, події), media.js (фото)
  components/  ui.jsx (кнопки, пігулки, заголовки, чипи, медіа), sections.jsx (картки й секції),
               Header, Footer, BookingForm, BookingModal, motion.jsx (анімації), Icon
  pages/       Home, Games, Game, Gallery, Blog, Article, About, Contacts, NotFound (+ Lab лише в dev)
  styles/      tokens → base → components → sections → pages → mobile
  analytics.js Google Analytics 4
  seo.js       заголовки, описи, картинки для поширення й schema.org для кожної сторінки
  entry-server.jsx  рендер сторінки в HTML під час збирання
scripts/       prerender.mjs (HTML усіх сторінок, 404.html, sitemap.xml, robots.txt), serve.mjs (локальний перегляд dist)
.claude/figma-export/   скрипти перенесення між сайтом і Фігмою; pending.md = зміни у Фігмі, ще не перенесені в код
```

## Публікація (Cloudflare)

Проєкт у Cloudflare (Workers & Pages → `bavys-landing`) підключений до цього репозиторію: кожен push у
`main` збирає (`npm run build`) і публікує сайт (`npx wrangler deploy`). Що й як віддавати, описано в
`wrangler.jsonc`: статичні файли з `dist/`, `/games` відкриває `games.html`, неіснуючі адреси показують
`404.html` зі статусом 404. Node 22 (файл `.node-version`).
Робоча гілка: `claude/wooden-games-rental-design-zg50rp`; коли зміни готові, вона зливається в `main`.

### Пошук Google

У `.env.production` вкажіть публічну адресу: `VITE_SITE_URL=https://ваш-домен`. Тоді збірка додає
канонічні посилання, картинки для поширення й `sitemap.xml` (без неї вони пропускаються).
Після публікації: підтвердити домен у Google Search Console і надіслати `https://ваш-домен/sitemap.xml`.

## Заявки на пошту

Форма (`src/components/BookingForm.jsx`) збирає ім’я, телефон, дату події й коментар (і гру, якщо заявку
відкрили зі сторінки гри) та надсилає їх через [FormSubmit](https://formsubmit.co) листом-таблицею на
`company.leadsEmail` у `src/data/site.js`. Акаунт і ключ не потрібні.

- Найперша заявка надсилає на цю пошту лист **Activate Form**: його треба підтвердити один раз, після цього
  заявки приходять самі.
- Боти відсіюються прихованим полем `_honey`.
- Інший сервіс можна підключити змінною `VITE_FORM_ENDPOINT` (будь-який, що приймає такий самий JSON POST).

## Аналітика (Google Analytics 4)

1. Створіть ресурс GA4 і веб-потік з адресою сайту, скопіюйте ID виду `G-XXXXXXXXXX`.
2. Запишіть його у `.env.production`: `VITE_GA_ID=G-XXXXXXXXXX`, закомітьте, злийте в `main`.
3. У налаштуваннях потоку → Enhanced measurement вимкніть «Page changes based on browser history events»
   (перегляди сторінок сайт надсилає сам, інакше вони рахуватимуться двічі).
4. Позначте подію `generate_lead` як ключову (Admin → Events).

Події: `page_view` на кожну сторінку (з чистим шляхом, наприклад `/games/velyka-dzhenga`), `booking_open`,
`generate_lead` (заявку надіслано), `click_phone`, `click_email`, `click_instagram`.
Без ID і в режимі розробки аналітика вимкнена.

## Бекапи й відкат

- Код зберігається на GitHub і локально; перед кожною публікацією ставиться тег `vРРРР-ММ-ДД`.
- Відкат: у Cloudflare (проєкт `bavys-landing` → Deployments) повернути попередню версію, або `git revert` і push у `main`.
- Відкинутий варіант hero збережено в гілці `backup/home-hero-1f77354`.
- Не в git: оригінали зображень з Фігми (`.claude/figma-export/raw/`) і сам дизайн (версії у Фігмі).
