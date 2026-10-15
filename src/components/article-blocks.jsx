/**
 * Body of a rich blog article (post.blocks): headings, text, lists, photos, game
 * cards, checklists, tables, FAQ and calls to action. Older posts keep using
 * `sections` (see pages/Article.jsx); both render in the same column.
 *
 * block shapes:
 *   { type: 'h2', title }                      — also feeds the table of contents
 *   { type: 'p', text }
 *   { type: 'list', items: [..], ordered? }
 *   { type: 'figure', photo, caption, position? }
 *   { type: 'photos', items: [{ photo, caption, position? }] }
 *   { type: 'games', items: [{ slug, text }] }  — cards with the photo, players, price and a link
 *   { type: 'checklist', title, items: [..] }
 *   { type: 'table', head: [..], rows: [[..]], note? }
 *   { type: 'callout', title, text, links?: [{ label, to }], book? }
 *   { type: 'faq', items: [{ q, a }] }
 *   { type: 'quote', text }
 */
import Icon from './Icon.jsx';
import { Button, Chip, Media } from './ui.jsx';
import { findGame, gamePrice } from '../data/games.js';
import { href } from '../router.js';

/** Headings of the article, with the anchor each one gets (used by the contents list too). */
export const articleHeadings = (blocks) =>
  blocks.reduce((acc, b) => (b.type === 'h2' ? [...acc, { id: `s${acc.length + 1}`, title: b.title }] : acc), []);

function Figure({ photo, caption, position }) {
  return (
    <figure className="article-fig">
      <div className="article-fig__media">
        <Media photo={photo} position={position} alt={caption} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Photos({ items }) {
  return (
    <ul className={`article-photos article-photos--${items.length}`} role="list">
      {items.map((it) => (
        <li key={it.photo}>
          <div className="article-photos__media">
            <Media photo={it.photo} position={it.position} alt={it.caption} />
          </div>
          {it.caption ? <span>{it.caption}</span> : null}
        </li>
      ))}
    </ul>
  );
}

function Games({ items }) {
  return (
    <ul className="article-games" role="list">
      {items.map(({ slug, text }) => {
        const g = findGame(slug);
        if (!g) return null;
        return (
          <li key={slug}>
            <a className="article-game" href={href(`/games/${slug}`)}>
              <span className="article-game__media">
                <Media photo={g.photo} alt={g.name} />
              </span>
              <span className="article-game__body">
                <span className="article-game__chips">
                  <Chip icon="users" tone="soft">
                    {g.players}
                  </Chip>
                  <Chip tone="soft">{gamePrice(g).replace(' / доба', ' на добу')}</Chip>
                </span>
                <strong className="article-game__name">{g.name}</strong>
                <span className="article-game__text">{text}</span>
                <span className="article-game__more">
                  Правила й комплектація <Icon name="arrowUpRight" size={16} />
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function ArticleBlocks({ blocks }) {
  let h = 0;
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'h2':
        h += 1;
        return (
          <h2 key={i} id={`s${h}`} className="article-h2">
            {b.title}
          </h2>
        );
      case 'p':
        return (
          <p key={i} className="article-p">
            {b.text}
          </p>
        );
      case 'list': {
        const L = b.ordered ? 'ol' : 'ul';
        return (
          <L key={i} className={`article-list ${b.ordered ? 'article-list--ordered' : ''}`}>
            {b.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </L>
        );
      }
      case 'figure':
        return <Figure key={i} {...b} />;
      case 'photos':
        return <Photos key={i} items={b.items} />;
      case 'games':
        return <Games key={i} items={b.items} />;
      case 'checklist':
        return (
          <aside key={i} className="article-check">
            <h3>{b.title}</h3>
            <ul role="list">
              {b.items.map((t) => (
                <li key={t}>
                  <span className="article-check__tick" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        );
      case 'table':
        return (
          <div key={i} className="article-table-wrap">
            <table className="article-table">
              <thead>
                <tr>
                  {b.head.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
            {b.note ? <p className="article-table__note">{b.note}</p> : null}
          </div>
        );
      case 'callout':
        return (
          <aside key={i} className="article-callout">
            <h3>{b.title}</h3>
            <p>{b.text}</p>
            {b.links || b.book ? (
              <div className="article-callout__actions">
                {b.book ? <Button book variant="light">Забронювати</Button> : null}
                {(b.links || []).map((l) => (
                  <Button key={l.to} to={l.to} variant="outline-light" disc={false}>
                    {l.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </aside>
        );
      case 'faq':
        return (
          <dl key={i} className="article-faq">
            {b.items.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        );
      case 'quote':
        return (
          <blockquote key={i} className="article__quote">
            <Icon name="motif" size={28} />
            <p>{b.text}</p>
            <cite>— команда Бавись</cite>
          </blockquote>
        );
      default:
        return null;
    }
  });
}
