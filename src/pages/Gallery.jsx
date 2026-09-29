import { useState } from 'react';
import { gallery, galleryCategories } from '../data/gallery.js';
import { Button } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GalleryGrid, PageHero } from '../components/sections.jsx';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all' ? gallery : gallery.filter((g) => g.tags.includes(filter));

  return (
    <>
      <PageHero
        media={{ photo: 'event-jenga', position: '85% 60%' }}
        label="Галерея"
        title="Живі моменти"
        accent="з наших свят"
        text="Справжні фото ігор і гостей на весіллях, корпоративах і фестивалях. Без постановки — так виглядає свято з Бавись."
        actions={
          <Button to="/games" variant="light">
            Обрати гру
          </Button>
        }
      />

      <section className="section section--cream gallery-page">
        <div className="container">
          <FilterBar items={galleryCategories} value={filter} onChange={setFilter} label="Фільтр фото" className="filter-bar--center" />
        </div>
        <div className="container-wide">
          {items.length ? (
            <GalleryGrid items={items} layout={filter === 'all' ? 'editorial' : 'uniform'} moreTile={filter === 'all'} />
          ) : (
            <p className="empty-state">Фото з цієї категорії з’являться зовсім скоро. А поки — зазирніть до нашого Instagram.</p>
          )}
        </div>
      </section>

      <CtaBanner tone="white" title="Хочете такі ж" accent="фото зі свого свята?" />
    </>
  );
}
