import { useState } from 'react';
import { galleryCategories, homeGallery } from '../data/gallery.js';
import { Media } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GalleryBento, PageTitle } from '../components/sections.jsx';

/**
 * Gallery: a light title with the chips, then the real event photos in the
 * same full-bleed bento as the home page, no captions. A chip shows the
 * matching photos in an even grid.
 */
export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all' ? homeGallery : homeGallery.filter((g) => g.tags.includes(filter));

  return (
    <>
      <PageTitle title="Живі моменти" accent="з наших свят">
        <FilterBar items={galleryCategories} value={filter} onChange={setFilter} label="Фільтр фото" className="filter-bar--chips" />
      </PageTitle>

      <section className="gallery-page">
        {filter === 'all' ? (
          <GalleryBento items={items} />
        ) : items.length ? (
          <div className="container">
            <ul className="photo-grid" role="list">
              {items.map((it) => (
                <li key={it.photo}>
                  <Media photo={it.photo} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="container">
            <p className="empty-state">Фото з цієї категорії з’являться зовсім скоро.</p>
          </div>
        )}
      </section>

      <CtaBanner tone="white" title="Хочете такі ж фото" accent="зі свого свята?" />
    </>
  );
}
