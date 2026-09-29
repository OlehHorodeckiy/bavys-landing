import { blogCategory, findPost, posts } from '../data/posts.js';
import { findGame } from '../data/games.js';
import Icon from '../components/Icon.jsx';
import { Button, Chip, Heading, IconButton, Media, SectionHead } from '../components/ui.jsx';
import { CtaBanner, GameGrid, PageHero, PostCard } from '../components/sections.jsx';
import NotFound from './NotFound.jsx';

export default function Article({ slug }) {
  const post = findPost(slug);
  if (!post) return <NotFound />;

  const cat = blogCategory(post.category);
  const relatedGames = post.relatedGames.map(findGame).filter(Boolean);
  const relatedPosts = posts.filter((p) => p.slug !== post.slug).sort((a, b) => (b.category === post.category) - (a.category === post.category)).slice(0, 3);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = [
    { id: 'facebook', label: 'Поділитися у Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { id: 'telegram', label: 'Поділитися в Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
  ];
  const [first, second, ...rest] = post.sections;

  return (
    <>
      <PageHero media={post.media.photo ? post.media : null} label={`Блог · ${cat?.label}`} title={post.title} size="short" className="hero--article" />

      <section className="section article">
        <div className="container article__grid">
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
              <Media {...post.media} alt="" />
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
            <div className="article__back">
              <Button to="/blog" variant="outline" disc={false}>
                <Icon name="arrowLeft" size={16} /> Усі статті
              </Button>
            </div>
          </article>
        </div>
      </section>

      {relatedGames.length ? (
        <section className="section section--cream article-games">
          <div className="container">
            <div className="split-head split-head--center">
              <Heading as="h2" title="Ігри" accent="зі статті" className="section-head__title" />
              <Button to="/games" variant="outline" disc={false}>
                Весь каталог <Icon name="arrowRight" size={16} />
              </Button>
            </div>
            <GameGrid games={relatedGames} />
          </div>
        </section>
      ) : null}

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
