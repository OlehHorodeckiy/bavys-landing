import { useState } from 'react';
import { allGalleryPhotos, galleryCategories, galleryMore, homeGallery } from '../data/gallery.js';
import { Media } from '../components/ui.jsx';
import { CtaBanner, FilterBar, GalleryBento, PageTitle } from '../components/sections.jsx';

/**
 * Gallery: a light title with the chips, then the real event photos: the same
 * bento as the home page and a second bento with the rest of the shots under it.
 * A chip shows the matching photos in the even grid.
 */
export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all' ? allGalleryPhotos : allGalleryPhotos.filter((g) => g.tags.includes(filter));
  // chips only for categories that have photos
  const chips = galleryCategories.filter((c) => c.id === 'all' || allGalleryPhotos.some((g) => g.tags.includes(c.id)));

  return (
    <>
      <PageTitle title="Живі моменти" accent="з наших свят">
        <FilterBar items={chips} value={filter} onChange={setFilter} label="Фільтр фото" className="filter-bar--chips" />
      </PageTitle>

      <section className="gallery-page">
        {filter === 'all' ? (
          <>
            <GalleryBento items={homeGallery} />
            <GalleryBento items={galleryMore} className="bento--more" />
          </>
        ) : items.length ? (
          <div className="container">
            <ul className="photo-grid" role="list">
              {items.map((it) => (
                <li key={it.photo}>
                  <Media photo={it.photo} position={it.position} />
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
