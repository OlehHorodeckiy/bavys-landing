import { useState } from 'react';
import { blogCategories, posts } from '../data/posts.js';
import { CtaBanner, FilterBar, PageTitle, PostCard } from '../components/sections.jsx';

export default function Blog() {
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <PageTitle title="Про ігри," accent="свята та людей" />

      <section className="section blog-page">
        <div className="container">
          <div className="blog-layout">
            <aside className="blog-layout__side">
              <h2 className="blog-layout__title">Теми</h2>
              <FilterBar items={blogCategories} value={cat} onChange={setCat} label="Теми блогу" className="filter-bar--vertical" />
            </aside>
            <div className="blog-layout__list">
              {list.length ? (
                list.map((p) => <PostCard key={p.slug} post={p} layout="row" headingLevel="h3" />)
              ) : (
                <p className="empty-state">У цій темі статті ще пишуться.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner tone="white" />
    </>
  );
}
