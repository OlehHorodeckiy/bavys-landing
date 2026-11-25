/**
 * The cart: which games the guest picked, how many tables and whether the
 * Beerpong kit goes too. Kept in localStorage, so it survives reloads and is the
 * same on every page and tab.
 *
 * Read through useCart() (useSyncExternalStore). The server snapshot is empty,
 * so prerendered HTML has no badge or bar and hydration matches; the saved cart
 * appears right after.
 *
 * `tables` is null until the guest touches the stepper: then the cart offers one
 * table per table game (cartState()).
 */
import { useSyncExternalStore } from 'react';
import { addons, bundlePrice, cartTotal, findGame } from './data/games.js';
import { track } from './analytics.js';

const PER_GAME = bundlePrice(1);

const KEY = 'bavys-cart';
const EMPTY = Object.freeze({ items: [], tables: null, kit: false });

let state = EMPTY;
let loaded = false;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY));
    if (v && Array.isArray(v.items)) {
      return { items: v.items.filter((s) => findGame(s)), tables: Number.isInteger(v.tables) ? v.tables : null, kit: Boolean(v.kit) };
    }
  } catch {
    /* private mode or a broken value: start empty */
  }
  return EMPTY;
}

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  state = read();
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = read();
      emit();
    }
  });
}

function write(next) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* the cart still works for this visit */
  }
  emit();
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => EMPTY;

/** { items, tables, kit } plus the day total (data/games.js cartTotal). */
export function cartState(s) {
  const needs = s.items.filter((slug) => findGame(slug)?.table).length;
  const tables = needs ? (s.tables ?? needs) : 0;
  return { ...s, tables, total: cartTotal(s.items, { tables, kit: s.kit }) };
}

/**
 * The summary rows of a cart total, in the Figma order. They add up to the
 * total: the shared-price games at 850 each, own-price games, the kit, the
 * tables, then the package discount as a minus.
 */
export function summaryRows(t) {
  const rows = [];
  const n = t.bundleCount;
  const full = n * PER_GAME;
  if (n > 1) rows.push({ label: `${n} ${n < 5 ? 'гри' : 'ігор'} по ${uah(PER_GAME)}`, value: full });
  else if (n === 1) rows.push({ label: t.items.find((g) => !g.price).name, value: full });
  t.own.forEach((o) => rows.push({ label: o.name, value: o.price }));
  if (t.kit) rows.push({ label: 'Комплект для Бірпонгу', value: addons.kit });
  if (t.tables) rows.push({ label: `Столи для ігор × ${t.tables}`, value: t.tablesPrice });
  if (t.save > 0) rows.push({ label: 'Знижка за комплект', value: -t.save, save: true });
  return rows;
}

/** 2850 → «2 850 грн» (no-break spaces, as on the prices page). */
export const uah = (n) => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('uk-UA').replace(/\s/g, '\u00a0')}\u00a0грн`;

export const useCart = () => cartState(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));

export const inCart = (slug) => getSnapshot().items.includes(slug);

export function addToCart(slug) {
  load();
  if (state.items.includes(slug)) return;
  write({ ...state, items: [...state.items, slug] });
  track('add_to_cart', { game: slug });
}

export function removeFromCart(slug) {
  load();
  const items = state.items.filter((s) => s !== slug);
  write({ ...state, items, kit: state.kit && items.some((s) => findGame(s)?.addon) });
  track('remove_from_cart', { game: slug });
}

export const toggleCart = (slug) => (inCart(slug) ? removeFromCart(slug) : addToCart(slug));

export function setTables(n) {
  load();
  write({ ...state, tables: Math.max(0, Math.min(20, n)) });
}

export function setKit(on) {
  load();
  write({ ...state, kit: Boolean(on) });
}

export function clearCart() {
  load();
  write(EMPTY);
}

/* opening the cart panel from anywhere (header, bar, «Змінити» in the form) */
const OPEN = 'bavys:cart';
export const openCart = () => window.dispatchEvent(new CustomEvent(OPEN));
export const onCart = (fn) => {
  window.addEventListener(OPEN, fn);
  return () => window.removeEventListener(OPEN, fn);
};
