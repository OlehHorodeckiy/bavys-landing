import Icon from '../components/Icon.jsx';
import { Button, Heading, Media, Pill } from '../components/ui.jsx';
import { AdvantagesSection, CtaBanner, PageHero, StatsRow, StepsSection } from '../components/sections.jsx';

const service = [
  'Доставка по Львову та області у зручний для локації час',
  'Монтаж і розстановка ігрової зони під ваш простір',
  'Пояснення правил гостям або адміністратор на місці',
  'Чисті, відшліфовані ігри у фірмовому пакуванні',
  'Демонтаж і вивіз після завершення свята',
];

export default function About() {
  return (
    <>
      <PageHero
        media={{ photo: 'event-jenga', position: '40% 40%' }}
        label="Про компанію"
        title="Бавись — це"
        accent="про гру разом"
        text="Ми — команда зі Львова, яка вірить, що найкращі свята — ті, де гості не сидять за столами, а грають, сміються і знайомляться."
        actions={
          <Button to="/games" variant="light">
            Наші ігри
          </Button>
        }
      />

      <section className="section section--cream about-story">
        <div className="container about-story__grid">
          <div className="collage">
            <div className="collage__item collage__item--tall">
              <Media photo="event-jenga" position="80% 50%" />
            </div>
            <div className="collage__item">
              <Media photo="tower" />
            </div>
            <div className="collage__item">
              <Media photo="lawn-tower" position="50% 75%" />
            </div>
          </div>
          <div className="about-story__copy">
            <Pill>Наша історія</Pill>
            <Heading as="h2" title="Із любові" accent="до дерев’яних ігор" br className="section-head__title" />
            <p>
              Бавись починався з кількох великих ігор, які ми робили для свят друзів. Гості не відходили від них до ночі — і
              ми зрозуміли, що це варто робити для всіх.
            </p>
            <p>
              Сьогодні в нашій колекції — десятки дерев’яних ігор для дорослих і дітей, а за плечима — весілля, корпоративи,
              фестивалі та сімейні свята по всій Львівщині. Ми дбаємо про кожну гру так, ніби вона їде на наше власне свято.
            </p>
          </div>
        </div>
        <div className="container">
          <StatsRow />
        </div>
      </section>

      <AdvantagesSection tone="dark" label="Як ми працюємо" title="Принципи," accent="яких ми тримаємось" text="Великий сервіс для великих ігор: ми відповідаємо за результат, а не лише за доставку." />

      <section className="section about-service">
        <div className="container about-service__grid">
          <div className="about-service__copy">
            <Pill tone="cream">Сервіс</Pill>
            <Heading as="h2" title="Що входить" accent="в оренду" br className="section-head__title" />
            <p>Ви отримуєте не набір коробок, а готову ігрову зону. Ось що ми робимо для кожної події.</p>
            <ul className="checklist" role="list">
              {service.map((s) => (
                <li key={s}>
                  <Icon name="motif" size={20} />
                  {s}
                </li>
              ))}
            </ul>
            <Button to="/contacts">Обговорити подію</Button>
          </div>
          <div className="about-service__media">
            <Media photo="lawn-tower" position="50% 70%" />
          </div>
        </div>
      </section>

      <StepsSection label="Бронювання" />

      <CtaBanner />
    </>
  );
}
