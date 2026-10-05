import Icon from '../components/Icon.jsx';
import { Heading, Logo, Media, Pill } from '../components/ui.jsx';
import { CtaBanner, PageTitle, StepsTiles } from '../components/sections.jsx';
import { games, rental } from '../data/games.js';

const service = [
  { icon: 'truck', text: 'Доставка по Львову та області у зручний для локації час' },
  { icon: 'blocks', text: 'Монтаж і розстановка ігрової зони під ваш простір' },
  { icon: 'chat', text: 'Пояснення правил гостям або адміністратор на місці' },
  { icon: 'sparkle', text: 'Чисті, відшліфовані ігри у фірмовому пакуванні' },
  { icon: 'calendar', text: 'Демонтаж і вивіз після завершення свята' },
  { icon: 'phone', text: 'Один адміністратор на зв’язку від заявки до кінця свята' },
];

// real numbers only: the catalog size, the rental price, where we work
const facts = [
  { value: String(games.length), text: 'дерев’яних ігор у колекції' },
  { value: rental.price.split(' / ')[0], text: 'за гру на добу' },
  { value: 'Львів', text: 'та область, з доставкою' },
];

export default function About() {
  return (
    <>
      <section className="about-intro">
        <div className="about-intro__bg" aria-hidden="true">
          <Media photo="lawn-strip" alt="" eager />
        </div>
        <PageTitle
          label="Про компанію"
          title="Бавись — це"
          accent="про гру разом"
          text="Ми команда зі Львова, яка вірить, що найкращі свята там, де гості не сидять за столами, а грають, сміються і знайомляться."
        />
        <div className="container about-intro__photos">
          {['about-kids-table', 'about-jenga-tower', 'about-connect4-kids'].map((p) => (
            <div className="about-intro__photo" key={p}>
              <Media photo={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="section section--cream about-story">
        <div className="container about-story__grid">
          <div className="about-story__logo" aria-hidden="true">
            <Logo />
          </div>
          <div className="about-story__copy">
            <Pill>Наша історія</Pill>
            <Heading as="h2" title="Із любові" accent="до дерев’яних ігор" br className="about-story__title" />
            <p>
              Наша історія розпочалась з кількох великих ігор, які ми робили для свят друзів. Гості не відходили від них до
              ночі, і ми зрозуміли, що це варто робити для всіх.
            </p>
            <p>
              Сьогодні в нашій колекції {games.length} дерев’яних ігор для дорослих і дітей. Ми дбаємо про кожну так, ніби
              вона їде на наше власне свято.
            </p>
            <ul className="about-facts" role="list">
              {facts.map((f) => (
                <li key={f.value}>
                  <strong>{f.value}</strong>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-service">
        <div className="container">
          <Heading as="h2" title="Що входить" accent="в оренду" reveal className="about-service__title" />
          <p className="about-service__text">Ви отримуєте не набір коробок, а готову ігрову зону.</p>
          <ul className="service-tiles" role="list">
            {service.map((s) => (
              <li key={s.text}>
                <span className="service-tiles__icon">
                  <Icon name={s.icon} size={18} />
                </span>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StepsTiles tone="cream" />

      <CtaBanner tone="white" />
    </>
  );
}
