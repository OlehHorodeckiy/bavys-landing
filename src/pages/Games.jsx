import { useState } from 'react';
import { games } from '../data/games.js';
import { gameFilters } from '../data/site.js';
import { Button } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GameGrid, PageTitle } from '../components/sections.jsx';

/** Phones show the first 8 cards, then «Показати ще ігри» opens the rest (styles/mobile.css). */
const FIRST = 8;

/**
 * Catalog: a light title with the event chips right under it (the chips are the
 * filter), then the grid. «Усі ігри» carries the count.
 */
export default function Games({ query }) {
  const initial = gameFilters.some((f) => f.id === query.type) ? query.type : 'all';
  const [filter, setFilter] = useState(initial);
  const [showAll, setShowAll] = useState(false);
  const list = filter === 'all' ? games : games.filter((g) => g.tags.includes(filter));
  const chips = gameFilters.map((f) => (f.id === 'all' ? { ...f, label: `${f.label} · ${games.length}` } : f));

  return (
    <>
      <PageTitle
        label="Каталог"
        title="Наші"
        accent="дерев’яні ігри"
        text="Уся колекція в одному місці. Оберіть формат події, і ми покажемо ігри, які на ньому працюють найкраще."
      >
        <FilterBar items={chips} value={filter} onChange={setFilter} label="Фільтр ігор за подією" className="filter-bar--chips" />
      </PageTitle>

      <section className={`section catalog ${showAll ? 'is-expanded' : ''}`}>
        <div className="container">
          {list.length ? (
            <>
              <GameGrid games={list} headingLevel="h2" />
              {!showAll && list.length > FIRST ? (
                <div className="catalog__more">
                  <Button full onClick={() => setShowAll(true)}>
                    Показати ще ігри
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <p className="empty-state">Для цієї категорії ігри ще додаються. Напишіть нам, і ми підберемо варіанти.</p>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
