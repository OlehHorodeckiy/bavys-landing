import { useState } from 'react';
import { games } from '../data/games.js';
import { company, gameFilters } from '../data/site.js';
import Icon from '../components/Icon.jsx';
import { Button, Heading } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GameGrid, GameStrip, PageHero } from '../components/sections.jsx';

const plural = (n) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'гра';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'гри';
  return 'ігор';
};

export default function Games({ query }) {
  const initial = gameFilters.some((f) => f.id === query.type) ? query.type : 'all';
  const [filter, setFilter] = useState(initial);
  const list = filter === 'all' ? games : games.filter((g) => g.tags.includes(filter));

  return (
    <>
      <PageHero
        size="catalog"
        label="Каталог"
        title="Наші"
        accent="дерев’яні ігри"
        text="Уся колекція в одному місці. Оберіть формат події — і ми покажемо ігри, які на ньому працюють найкраще."
        actions={
          <Button to="/contacts" variant="light">
            Допоможіть обрати
          </Button>
        }
      >
        <GameStrip games={[...games.slice(4), ...games.slice(0, 4)]} />
      </PageHero>

      <section className="section catalog">
        <div className="container">
          <div className="catalog__bar">
            <FilterBar items={gameFilters} value={filter} onChange={setFilter} label="Фільтр ігор за подією" />
            <p className="catalog__count" aria-live="polite">
              {list.length} {plural(list.length)}
            </p>
          </div>

          {list.length ? (
            <GameGrid games={list} headingLevel="h2" />
          ) : (
            <p className="empty-state">Для цієї категорії ігри ще додаються. Напишіть нам — підберемо варіанти.</p>
          )}

          <div className="help-card">
            <div>
              <Heading as="h2" title="Не знаєте," accent="що обрати?" className="help-card__title" />
              <p>Розкажіть про подію — адміністратор підбере набір ігор під кількість гостей, локацію та вік.</p>
            </div>
            <div className="help-card__actions">
              <Button to="/contacts">Надіслати заявку</Button>
              <Button href={company.phoneHref} variant="outline" disc={false}>
                <Icon name="phone" size={18} /> {company.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
