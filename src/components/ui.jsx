/**
 * Design-system primitives: buttons, label pills, two-tone headings, chips and
 * the media slot every card and hero uses.
 */
import Icon from './Icon.jsx';
import GameArt from './GameArt.jsx';
import { photos } from '../data/media.js';
import { href as toHref } from '../router.js';

/* ------------------------------------------------------------------ Logo */

export function Logo({ className = '' }) {
  return <span className={`logo ${className}`} role="img" aria-label="Бавись" />;
}

/* ---------------------------------------------------------------- Button */

/**
 * variants:
 *   primary  — brown fill, white label, white disc with a dark arrow
 *   light    — white fill, brown label, brown disc (on dark photography)
 *   outline  — hairline outline, no disc (secondary actions)
 *   outline-light — white hairline on dark
 *   nav      — white pill without a disc (header CTA)
 */
export function Button({ to, query, href, children, variant = 'primary', disc, icon = 'arrowUpRight', type = 'button', onClick, className = '', full = false, ...rest }) {
  const showDisc = disc ?? (variant === 'primary' || variant === 'light');
  const cls = `btn btn--${variant} ${showDisc ? 'btn--disc' : ''} ${full ? 'btn--full' : ''} ${className}`;
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {showDisc ? (
        <span className="btn__disc" aria-hidden="true">
          <Icon name={icon} size={16} strokeWidth={1.8} />
        </span>
      ) : null}
    </>
  );
  const link = to ? toHref(to, query) : href;
  if (link) {
    return (
      <a className={cls} href={link} onClick={onClick} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

/** Round icon button (carousel-style arrows, socials, menu). */
export function IconButton({ icon, label, href, onClick, variant = 'outline', size = 20, className = '' }) {
  const cls = `icon-btn icon-btn--${variant} ${className}`;
  if (href) {
    return (
      <a className={cls} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        <Icon name={icon} size={size} />
      </a>
    );
  }
  return (
    <button className={cls} type="button" aria-label={label} onClick={onClick}>
      <Icon name={icon} size={size} />
    </button>
  );
}

/* ----------------------------------------------------------- Label pill */

/** The small uppercase label with a dot that sits above every heading. */
export function Pill({ children, tone = 'white', className = '' }) {
  return (
    <p className={`pill pill--${tone} ${className}`}>
      <span className="pill__dot" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------ Two-tone heading */

/**
 * Headline with a lighter, coloured accent — Comfortaa's answer to the
 * reference's serif-italic second voice.
 */
export function Heading({ as: Tag = 'h2', title, accent, accentFirst = false, br = false, className = '' }) {
  const acc = accent ? <span className="accent">{accent}</span> : null;
  return (
    <Tag className={className}>
      {accentFirst ? acc : null}
      {accentFirst && title ? ' ' : null}
      {title}
      {!accentFirst && accent ? (br ? <br /> : ' ') : null}
      {!accentFirst ? acc : null}
    </Tag>
  );
}

export function SectionHead({ label, labelTone, title, accent, br, text, align = 'center', as = 'h2', children, className = '' }) {
  return (
    <div className={`section-head section-head--${align} ${className}`}>
      {label ? <Pill tone={labelTone}>{label}</Pill> : null}
      <Heading as={as} title={title} accent={accent} br={br} className="section-head__title" />
      {text ? <p className="section-head__text">{text}</p> : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Chips */

/** Small white chip laid over photos — category dot or icon + short text. */
export function Chip({ children, dot, icon, tone = 'white' }) {
  return (
    <span className={`chip chip--${tone}`}>
      {dot ? <span className="chip__dot" style={{ background: dot }} aria-hidden="true" /> : null}
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </span>
  );
}

/** Outline tag with the block motif (reference: "PERSONALIZED · CERTIFIED"). */
export function MotifTag({ children }) {
  return (
    <span className="motif-tag">
      <Icon name="motif" size={18} />
      {children}
    </span>
  );
}

/** Dashed hairline used between groups, as in the reference. */
export const Rule = ({ className = '' }) => <hr className={`rule ${className}`} />;

/* ------------------------------------------------------------------ Media */

/**
 * A photo from data/media.js or, when there is none, an illustrated game tile.
 *   <Media photo="event-jenga" position="70% 50%" />
 *   <Media art="kubb" />
 */
export function Media({ photo, art, position, className = '', eager = false, alt }) {
  const p = photo ? photos[photo] : null;
  if (p) {
    return (
      <div className={`media ${p.backdrop ? `media--${p.backdrop}` : ''} ${className}`}>
        <img
          src={p.src}
          alt={alt ?? p.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: position || undefined, objectFit: p.fit || undefined }}
        />
      </div>
    );
  }
  return <GameArt name={art} className={`media media--art ${className}`} />;
}

/** Media for a game — its photo if it has one, else its illustration. */
export const GameMedia = ({ game, ...rest }) => <Media photo={game.photo} art={game.art} alt={game.name} {...rest} />;
