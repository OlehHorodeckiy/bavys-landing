import { useState } from 'react';
import { games } from '../data/games.js';
import { gameFilters } from '../data/site.js';
import { Button } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GameGrid, PageTitle } from '../components/sections.jsx';

/** Phones show the first 8 cards, then «Показати ще ігри» opens the rest (styles/mobile.css). */
const FIRST = 8;

/** Games for a chip: the ones made for this event first (their main event), then the rest that suit it. */
const forFilter = (id) => {
  if (id === 'all') return games;
  const fit = games.filter((g) => g.tags.includes(id));
  return [...fit.filter((g) => g.events[0] === id), ...fit.filter((g) => g.events[0] !== id)];
};

/**
 * Catalog: a light title with the event chips right under it (the chips are the
 * filter), then the grid. The active chip carries the count. A chip change
 * re-orders the cards (games made for that event first), names the event on
 * every card and plays the cards' rise again, so the change is visible.
 */
export default function Games({ query }) {
  const initial = gameFilters.some((f) => f.id === query.type) ? query.type : 'all';
  const [filter, setFilter] = useState(initial);
  const [changed, setChanged] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const list = forFilter(filter);
  const chips = gameFilters.map((f) => (f.id === filter ? { ...f, label: `${f.label} · ${forFilter(f.id).length}` } : f));

  const choose = (id) => {
    if (id === filter) return;
    setFilter(id);
    setChanged(true);
    setShowAll(false);
    // keep the choice in the address (refresh, back, sharing)
    window.history.replaceState(window.history.state, '', id === 'all' ? '/games' : `/games?type=${id}`);
  };

  return (
    <>
      <PageTitle
        label="Каталог"
        title="Наші"
        accent="дерев’яні ігри"
        text="Уся колекція в одному місці. Оберіть формат події, і ми покажемо ігри, які на ньому працюють найкраще."
      >
        <FilterBar items={chips} value={filter} onChange={choose} label="Фільтр ігор за подією" className="filter-bar--chips" />
      </PageTitle>

      <section className={`section catalog ${showAll ? 'is-expanded' : ''}`}>
        <div className="container">
          {list.length ? (
            <>
              <GameGrid key={filter} games={list} headingLevel="h2" event={filter === 'all' ? undefined : filter} delay={changed ? 0 : 0.4} />
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
