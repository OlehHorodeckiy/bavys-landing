import { useEffect } from 'react';

const heroPhotos = [
  {
    src: '/assets/hero-bg.png',
    alt: "Велика дерев'яна Дженга на події",
  },
  {
    src: '/assets/hero-grass-scene.png',
    alt: "Велика дерев'яна Дженга на траві",
  },
  {
    src: '/assets/jenga-tower.png',
    alt: "Башта з дерев'яних брусків",
  },
  {
    src: '/assets/hero-bg.png',
    alt: "Дерев'яні бруски у теплій атмосфері події",
  },
];

const benefits = [
  ['01', 'Натуральне дерево', "Відшліфовані поверхні, безпечні покриття та приємна тактильність для дітей."],
  ['02', 'Montessori логіка', 'Іграшки підтримують самостійність, дрібну моторику, баланс і творче мислення.'],
  ['03', 'Доставка у Львові', 'Привозимо, налаштовуємо та забираємо набори після події або оренди.'],
];

const rentals = [
  ['Велика Дженга', 'Для подвір’я, весіль, терас і сімейних вечорів.', 'від 900 грн'],
  ['Баланс-борди', 'Тиха активність для малюків і дітей дошкільного віку.', 'від 650 грн'],
  ['Ігровий сет', 'Кубики, сортери, доріжки, баланс і сенсорні елементи.', 'від 1400 грн'],
];

const customToys = [
  'Іменні кубики та сортери',
  'Великі ігри для брендів',
  'Декор для дитячої кімнати',
  'Подарункові набори з гравіюванням',
];

const events = [
  ['Весілля', 'Тиха зона для дітей поруч із дорослим святом.'],
  ['Дні народження', 'Дерев’яний play corner, що красиво виглядає на фото.'],
  ['Корпоративи', 'Сімейний формат для подій із дітьми співробітників.'],
  ['Маркет-події', 'Ігровий острівець, який затримує сім’ї біля стенду.'],
];

const gallery = [
  {
    src: '/assets/hero-bg.png',
    alt: "Дерев'яна Дженга у теплій зоні події",
  },
  {
    src: '/assets/hero-grass-scene.png',
    alt: "Оренда великої дерев'яної гри на відкритій локації",
  },
  {
    src: '/assets/jenga-tower.png',
    alt: "Натуральна дерев'яна башта",
  },
  {
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85',
    alt: 'Сімейна атмосфера на дитячій події',
  },
];

const testimonials = [
  ['Марія, мама Софії', 'Брали набір на день народження. Діти були зайняті дві години, а зона виглядала дуже естетично.'],
  ['Оля, організаторка подій', 'Найприємніше, що все продумано: чисто, натурально, без пластику і дуже фотогенічно.'],
  ['Андрій та Христина', 'Замовили іменний набір у подарунок. Вийшло тепліше й особистіше, ніж будь-яка магазинна іграшка.'],
];

const stats = [
  ['120+', 'сімейних подій'],
  ['32', 'дерев’яні набори'],
  ['4.9/5', 'середня оцінка'],
  ['24 год', 'швидке бронювання'],
];

function Header() {
  return (
    <header className="nav">
      <a className="logo" href="#" aria-label="Бавись">
        <img src="/assets/Group.svg" alt="Бавись" />
      </a>
      <nav className="nav__links" aria-label="Головна навігація">
        <a href="#rent">Оренда</a>
        <a href="#custom">На замовлення</a>
        <a href="#events">Події</a>
        <a href="#gallery">Галерея</a>
      </nav>
      <a className="button button--light" href="#contact">Забронювати</a>
    </header>
  );
}

function SectionIntro({ eyebrow, title, text, align = 'left' }) {
  return (
    <div className={`section-intro section-intro--${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <Header />
      <div className="hero__copy">
        <p className="hero__pill">Оренда · виготовлення · ігрові зони у Львові</p>
        <h1>Дерев’яні іграшки для теплих сімейних моментів</h1>
        <p>
          Бавись створює eco-friendly play spaces: оренда великих дерев’яних ігор,
          іменні іграшки на замовлення та естетичні дитячі зони для подій.
        </p>
        <div className="hero__actions">
          <a className="button button--dark" href="#rent">Обрати набір</a>
          <a className="button button--ghost" href="#custom">Замовити іграшку</a>
        </div>
      </div>
      <div className="hero__media" aria-label="Атмосфера бренду Бавись">
        {heroPhotos.map((photo, index) => (
          <figure className={`hero-photo hero-photo--${index + 1}`} key={`${photo.src}-${index}`}>
            <img src={photo.src} alt={photo.alt} />
          </figure>
        ))}
        <div className="hero__mark">Львів<br />натурально<br />великі</div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="benefits section">
      <SectionIntro
        eyebrow="Чому Бавись"
        title="Іграшки, які красиво живуть у просторі"
        text="Ми поєднуємо натуральні матеріали, спокійну естетику та дитячу свободу руху."
        align="center"
      />
      <div className="benefit-grid">
        {benefits.map(([number, title, text]) => (
          <article className="soft-card" key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Rental() {
  return (
    <section className="rental section section--warm" id="rent">
      <div className="split">
        <SectionIntro
          eyebrow="Оренда іграшок"
          title="Для дому, саду, весілля чи дитячого свята"
          text="Підбираємо набір під вік дітей, кількість гостей і формат простору. Усе приїжджає чистим, готовим до гри та красивим у кадрі."
        />
        <div className="rental__list">
          {rentals.map(([title, text, price]) => (
            <article className="rental-card" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Custom() {
  return (
    <section className="custom section" id="custom">
      <div className="custom__media">
        <img
          src="/assets/hero-bg.png"
          alt="Велика дерев'яна Дженга як приклад виробу на замовлення"
        />
      </div>
      <div className="custom__copy">
        <SectionIntro
          eyebrow="Іграшки на замовлення"
          title="Персональні речі, які хочеться залишити в сімейній історії"
          text="Розробляємо форму, підбираємо дерево, додаємо гравіювання та пакування. Кожен набір має виглядати як подарунок, а не випадкова покупка."
        />
        <ul className="check-list">
          {customToys.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section className="events section" id="events">
      <SectionIntro
        eyebrow="Дитячі ігрові зони"
        title="Події, де дітям є де бути дітьми"
        text="Створюємо спокійні Montessori inspired куточки з дерев’яними активностями, щоб діти гралися, а дорослі могли бути присутніми у святі."
        align="center"
      />
      <div className="event-grid">
        {events.map(([title, text]) => (
          <article className="event-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery section" id="gallery">
      <SectionIntro
        eyebrow="Галерея"
        title="Теплі матеріали, великі форми, багато повітря"
        align="center"
      />
      <div className="gallery-grid">
        {gallery.map((photo, index) => (
          <figure className={`gallery-card gallery-card--${index + 1}`} key={`${photo.src}-${index}`}>
            <img src={photo.src} alt={photo.alt} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="testimonials section section--warm">
      <SectionIntro
        eyebrow="Відгуки"
        title="Батьки цінують спокій, діти повертаються до гри"
        align="center"
      />
      <div className="testimonial-grid">
        {testimonials.map(([name, text]) => (
          <article className="testimonial-card" key={name}>
            <p>“{text}”</p>
            <strong>{name}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats section">
      <div className="stats__panel">
        {stats.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="cta section" id="contact">
      <div className="cta__content">
        <p className="eyebrow">Бронювання</p>
        <h2>Підберемо іграшки під вашу дату, простір і вік дітей</h2>
        <p>
          Напишіть нам формат події, місто Львів або область, кількість дітей і бажаний настрій зони.
          Ми запропонуємо набір, логістику та вартість.
        </p>
        <div className="hero__actions">
          <a className="button button--light" href="tel:+380000000000">Подзвонити</a>
          <a className="button button--outline-light" href="mailto:hello@bavys.lviv.ua">Написати</a>
        </div>
      </div>
      <div className="cta__card">
        <span>Бавись</span>
        <strong>оренда розваг · Львів</strong>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section">
      <img src="/assets/Group.svg" alt="Бавись" />
      <p>Львів · дерев’яні іграшки · ігрові зони<br />Instagram · Telegram · hello@bavys.lviv.ua</p>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    document.body.classList.add('react-ready');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main className="page">
      <Hero />
      <Benefits />
      <Rental />
      <Custom />
      <Events />
      <Gallery />
      <Testimonials />
      <Stats />
      <Cta />
      <Footer />
    </main>
  );
}
