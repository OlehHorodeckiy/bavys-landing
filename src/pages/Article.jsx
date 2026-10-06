import { useEffect, useState } from 'react';
import { blogCategory, findPost, posts } from '../data/posts.js';
import { href } from '../router.js';
import { SITE_URL } from '../seo.js';
import Icon from '../components/Icon.jsx';
import { Button, Chip, Heading, IconButton, Media, Pill, SectionHead } from '../components/ui.jsx';
import { CtaBanner, PostCard } from '../components/sections.jsx';
import NotFound from './NotFound.jsx';

export default function Article({ slug }) {
  // the page address for the share links: the public one when known, else read in the browser after load
  const [url, setUrl] = useState(SITE_URL ? SITE_URL + href(`/blog/${slug}`) : '');
  useEffect(() => {
    if (!SITE_URL) setUrl(window.location.href);
  }, [slug]);
  const post = findPost(slug);
  if (!post) return <NotFound />;

  const cat = blogCategory(post.category);
  const relatedPosts = posts.filter((p) => p.slug !== post.slug).sort((a, b) => (b.category === post.category) - (a.category === post.category)).slice(0, 3);
  const share = [
    { id: 'facebook', label: 'Поділитися у Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { id: 'telegram', label: 'Поділитися в Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
  ];
  const [first, second, ...rest] = post.sections;
  // «Як обрати ігри для весілля: 5 порад…» → bold part up to the colon, the rest in the accent
  const colon = post.title.indexOf(':');
  const [title, accent] = colon > 0 ? [post.title.slice(0, colon + 1), post.title.slice(colon + 2)] : [post.title, null];

  return (
    <>
      <section className="section article">
        <div className="container article__grid">
          <header className="article__head">
            <Pill tone="cream">{`Блог · ${cat?.label}`}</Pill>
            <Heading as="h1" title={title} accent={accent} br className="article__title" />
          </header>
          <aside className="article__side">
            <div className="article-meta">
              <h2 className="article-meta__title">Про статтю</h2>
              <dl>
                <div>
                  <dt>Категорія</dt>
                  <dd>
                    <Chip dot="#866452" tone="white">{cat?.label}</Chip>
                  </dd>
                </div>
                <div>
                  <dt>Дата публікації</dt>
                  <dd>
                    <Chip icon="calendar" tone="white">{post.date}</Chip>
                  </dd>
                </div>
                <div>
                  <dt>Час читання</dt>
                  <dd>
                    <Chip icon="clock" tone="white">{post.read}</Chip>
                  </dd>
                </div>
                <div>
                  <dt>Поділитися</dt>
                  <dd className="article-meta__share">
                    {share.map((s) => (
                      <IconButton key={s.id} icon={s.id} label={s.label} href={s.href} variant="plain" />
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <article className="article__body">
            <p className="article__lead">{post.lead}</p>
            {[first, second].filter(Boolean).map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
            <figure className="article__figure">
              <Media {...(post.figure || post.media)} alt={post.figure?.caption || ''} />
            </figure>
            {post.quote ? (
              <blockquote className="article__quote">
                <Icon name="motif" size={28} />
                <p>{post.quote}</p>
                <cite>— команда Бавись</cite>
              </blockquote>
            ) : null}
            {rest.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
            {post.gallery?.length ? (
              <ul className="article__gallery" role="list" aria-label="Фото з події">
                {post.gallery.map((photo) => (
                  <li key={photo}>
                    <Media photo={photo} />
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="article__back">
              <Button to="/blog" variant="outline" disc={false}>
                <Icon name="arrowLeft" size={16} /> Усі статті
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="section article-related">
        <div className="container">
          <SectionHead label="Читайте також" labelTone="cream" title="Інші" accent="статті" />
          <div className="post-grid post-grid--cols">
            {relatedPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
