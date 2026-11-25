import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { Button } from './ui.jsx';
import { addToCart, removeFromCart, useCart } from '../cart.js';

/**
 * «+ У кошик» on a game card (Figma guide «Картка гри з кошиком», 3. Стани кнопки):
 * white with a brown hairline; a click shows «Додаємо…» for a moment and the
 * button turns brown «У кошику»; on a brown button the hover reads «Прибрати»
 * and a click takes the game out again.
 */
export function AddToCart({ game, className = '' }) {
  const { items } = useCart();
  const added = items.includes(game.slug);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    if (busy) return;
    if (added) {
      removeFromCart(game.slug);
      return;
    }
    setBusy(true);
    timer.current = setTimeout(() => {
      addToCart(game.slug);
      setBusy(false);
    }, 400);
  };

  return (
    <button
      type="button"
      className={`atc ${added ? 'is-added' : ''} ${busy ? 'is-busy' : ''} ${className}`}
      aria-pressed={added}
      aria-label={added ? `${game.name} у кошику. Прибрати` : `Додати ${game.name} у кошик`}
      onClick={onClick}
    >
      {busy ? (
        <span className="atc__state">
          <span className="atc__spinner" aria-hidden="true" />
          Додаємо…
        </span>
      ) : added ? (
        <>
          <span className="atc__state atc__state--on">
            <Icon name="check" size={14} strokeWidth={2} />У кошику
          </span>
          <span className="atc__state atc__state--off" aria-hidden="true">
            <Icon name="close" size={14} strokeWidth={2} />Прибрати
          </span>
        </>
      ) : (
        <span className="atc__state">
          <Icon name="plus" size={14} strokeWidth={2} />У кошик
        </span>
      )}
    </button>
  );
}

/**
 * The game page's one button (Figma «Сторінка гри · додати в кошик»): white
 * «Забронювати цю гру» adds the game to the cart and turns brown «Додано в кошик»;
 * another click takes it out.
 */
export function BookGameButton({ game, className = '' }) {
  const { items } = useCart();
  const added = items.includes(game.slug);
  return (
    <Button
      variant={added ? 'primary' : 'outline'}
      disc
      icon={added ? 'check' : 'arrowUpRight'}
      className={`book-game ${added ? 'is-added' : ''} ${className}`}
      aria-pressed={added}
      onClick={() => (added ? removeFromCart(game.slug) : addToCart(game.slug))}
    >
      {added ? 'Додано в кошик' : 'Забронювати цю гру'}
    </Button>
  );
}
