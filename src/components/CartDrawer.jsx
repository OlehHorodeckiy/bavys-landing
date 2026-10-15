import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import { Button, GameMedia } from './ui.jsx';
import { gamesWord } from './sections.jsx';
import { openCartBooking } from './booking.js';
import { lockScroll, unlockScroll } from './scrollLock.js';
import { onCart, removeFromCart, setKit, setTables, summaryRows, uah, useCart } from '../cart.js';
import { addons, priceValue } from '../data/games.js';
import { track } from '../analytics.js';
import { href } from '../router.js';

/**
 * The cart (Figma «Панель кошика (справа)» and «Мобільна версія · кошик відкрито»):
 * against the right edge on a dimmed page: from 1024px two columns (Figma «Кошик у
 * дві колонки»: the games on the left, the table stepper, the summary, the note
 * and the buttons on the right), narrower one column of 480; on phones a sheet
 * from the bottom with the total folded into one line («Деталі»). The list of
 * games always scrolls on its own. Esc, the cross and the backdrop close it; focus comes back.
 */
export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const cart = useCart();
  const t = cart.total;
  const panel = useRef(null);
  const back = useRef(null);

  useEffect(
    () =>
      onCart(() => {
        back.current = document.activeElement;
        setOpen(true);
        track('cart_open', { games: cart.items.length });
      }),
    [cart.items.length],
  );

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    panel.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll('button:not([disabled]), a[href], input');
      if (!f.length) return;
      const [a, z] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
      back.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const n = t.items.length;
  const rows = summaryRows(t);
  const checkout = () => {
    close();
    openCartBooking();
  };

  return createPortal(
    <div className="cart" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <aside className="cart__panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1}>
        <div className="cart__head">
          <h2 className="cart__title" id="cart-title">
            Кошик
          </h2>
          {n ? <span className="cart__count">{gamesWord(n)}</span> : null}
          <button type="button" className="cart__close" aria-label="Закрити кошик" onClick={close}>
            <Icon name="close" size={22} strokeWidth={1.5} />
          </button>
        </div>

        {n ? (
          <div className="cart__body">
            <ul className="cart__items" role="list">
              {t.items.map((g) => (
                <li key={g.slug} className="cart-item">
                  <a className="cart-item__thumb" href={href(`/games/${g.slug}`)} onClick={close} tabIndex={-1} aria-hidden="true">
                    <GameMedia game={g} alt="" />
                  </a>
                  <div className="cart-item__mid">
                    <a className="cart-item__name" href={href(`/games/${g.slug}`)} onClick={close}>
                      {g.name}
                    </a>
                    <p className="cart-item__price">{uah(priceValue(g))} / доба</p>
                    {g.addon ? (
                      <label className="cart-item__addon">
                        <input type="checkbox" checked={cart.kit} onChange={(e) => setKit(e.target.checked)} />
                        <span className="cart-item__check" aria-hidden="true">
                          <Icon name="check" size={12} strokeWidth={2.4} />
                        </span>
                        <span className="cart-item__addon-text">
                          {g.addon.label} <strong>+{uah(addons.kit)}</strong>
                        </span>
                      </label>
                    ) : null}
                  </div>
                  <button type="button" className="cart-item__remove" aria-label={`Прибрати ${g.name} з кошика`} onClick={() => removeFromCart(g.slug)}>
                    <Icon name="trash" size={20} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart__foot">
              <div className="cart__calc">
                {t.needsTable ? (
                  <div className="cart-addon">
                    <div className="cart-addon__text">
                      <p className="cart-addon__name">Стіл для ігор</p>
                      <p className="cart-addon__note">
                        {uah(addons.table)} / стіл · потрібен для {t.needsTable === 1 ? '1 гри' : `${t.needsTable} ігор`}
                      </p>
                    </div>
                    <div className="stepper" role="group" aria-label="Кількість столів">
                      <button type="button" aria-label="Менше столів" disabled={!cart.tables} onClick={() => setTables(cart.tables - 1)}>
                        <Icon name="minus" size={16} strokeWidth={2} />
                      </button>
                      <output aria-live="polite">{cart.tables}</output>
                      <button type="button" aria-label="Більше столів" onClick={() => setTables(cart.tables + 1)}>
                        <Icon name="plus" size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* phones: the total in one line, the rows behind «Деталі» (Figma 1732:24018) */}
                <div className="cart-fold">
                  <strong className="cart-fold__label">За добу</strong>
                  <strong className="cart-fold__sum">{uah(t.total)}</strong>
                  {t.save > 0 ? <span className="cart-fold__save">економія −{uah(t.save)}</span> : null}
                  <button type="button" className="cart-fold__more" aria-expanded={details} aria-controls="cart-sum" onClick={() => setDetails((d) => !d)}>
                    {details ? 'Згорнути' : 'Деталі'}
                  </button>
                </div>

                <dl className={`cart-sum ${details ? 'is-open' : ''}`} id="cart-sum">
                  {rows.map((r) => (
                    <div key={r.label} className={`cart-sum__row ${r.save ? 'is-save' : ''}`}>
                      <dt>{r.label}</dt>
                      <dd>{uah(r.value)}</dd>
                    </div>
                  ))}
                  <div className="cart-sum__row cart-sum__total">
                    <dt>За добу</dt>
                    <dd>{uah(t.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="cart__end">
                <p className="cart__note">Доставка рахується окремо за адресою. Передоплати немає, адміністратор зателефонує протягом доби.</p>

                <div className="cart__actions">
                  <button type="button" className="cart__btn cart__btn--primary" onClick={checkout}>
                    Оформити заявку<span className="cart__btn-sum"> · {uah(t.total)}</span>
                  </button>
                  <button type="button" className="cart__btn cart__btn--more" onClick={close}>
                    Продовжити вибір
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart__empty">
            <span className="cart__empty-icon" aria-hidden="true">
              <Icon name="bag" size={32} strokeWidth={1.5} />
            </span>
            <p className="cart__empty-title">Кошик порожній</p>
            <p className="cart__empty-text">Додайте ігри з каталогу, і ми порахуємо ціну комплекту.</p>
            <Button to="/games" variant="primary" disc={false} onClick={close}>
              До каталогу
            </Button>
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}

/** Header cart button: the bag with a brown count badge; opens the cart. */
export function CartButton({ onOpen }) {
  const { items } = useCart();
  const n = items.length;
  return (
    <button type="button" className="cart-btn" aria-label={n ? `Кошик, ${gamesWord(n)}` : 'Кошик, порожній'} aria-haspopup="dialog" onClick={onOpen}>
      <Icon name="bag" size={22} strokeWidth={1.5} />
      {n ? (
        <span className="cart-btn__badge" aria-hidden="true">
          {n}
        </span>
      ) : null}
    </button>
  );
}

/**
 * Phone-only bar while the cart has games (Figma «Каталог ігор — з кошиком — 390»):
 * «Обрано N ігор» with the day total and a white «Оформити» that opens the request.
 * It takes the place of the «Забронювати + Instagram» bar.
 */
export function CartBar({ onOpen }) {
  const cart = useCart();
  const n = cart.items.length;
  if (!n) return null;
  return (
    <div className="cart-bar" role="region" aria-label="Кошик">
      <button type="button" className="cart-bar__info" onClick={onOpen}>
        <span className="cart-bar__count">Обрано {n === 1 ? '1 гру' : gamesWord(n)}</span>
        <span className="cart-bar__sum">{uah(cart.total.total)} / доба</span>
      </button>
      <button type="button" className="cart-bar__btn" onClick={openCartBooking}>
        Оформити
      </button>
    </div>
  );
}
