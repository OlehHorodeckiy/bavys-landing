import { useEffect, useRef, useState } from 'react';
import { findGame } from '../data/games.js';
import { company } from '../data/site.js';
import Icon from './Icon.jsx';
import { Button, Heading } from './ui.jsx';
import { track } from '../analytics.js';

/**
 * Booking request form: the one conversion of the whole site, used in the
 * booking popup and on the contacts page. Name, phone, date and a free comment;
 * no game picker (the comment asks which games). When the form is opened from a
 * game page that game is quietly added to the request.
 *
 * Delivery: the request is posted as JSON to FormSubmit, which e-mails it to
 * company.leadsEmail as a table (no account or key; the very first request sends
 * an activation link to that inbox, and requests arrive once it is clicked).
 * VITE_FORM_ENDPOINT overrides the endpoint with any service that takes the same
 * JSON POST. The hidden _honey field catches bots: FormSubmit drops filled ones.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || `https://formsubmit.co/ajax/${company.leadsEmail}`;

const today = () => new Date().toISOString().slice(0, 10);

/** 2026-10-04 → 04.10.2026 */
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('.') : 'не вказана');

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Вкажіть, як до вас звертатися';
  if (v.phone.replace(/\D/g, '').length < 10) errors.phone = 'Вкажіть номер телефону, щоб ми могли зателефонувати';
  return errors;
}

/** One request as the rows of the e-mail table (FormSubmit keeps the key order). */
function toPayload(v, gameName, honey) {
  return {
    _subject: `Заявка на оренду ігор: ${v.name}`,
    _template: 'table',
    _captcha: 'false',
    _honey: honey,
    'Ім’я': v.name,
    Телефон: v.phone,
    'Дата події': formatDate(v.date),
    ...(gameName ? { 'Сторінка гри': gameName } : {}),
    Коментар: v.message || 'без коментаря',
  };
}

function Field({ id, label, required, error, icon, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${icon ? 'field--icon' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className="field__control">
        {icon ? <Icon name={icon} size={18} className="field__icon" /> : null}
        {children}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * variant: 'modal' (popup, «Забронювати ігри») | 'page' (contacts, «Надішліть заявку»)
 * onDone: called by the success state's button (the popup closes itself).
 */
export default function BookingForm({ game, variant = 'page', onDone }) {
  const [values, setValues] = useState({ name: '', phone: '', date: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const first = useRef(null);
  const [minDate, setMinDate] = useState(undefined); // set in the browser, so prerendered HTML has no stale date
  useEffect(() => setMinDate(today()), []);
  const honey = useRef(null);
  const gameName = game ? findGame(game)?.name : null;
  const id = (k) => `bf-${variant}-${k}`;

  useEffect(() => {
    if (variant === 'modal') first.current?.focus();
  }, [variant]);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(id(Object.keys(found)[0]))?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toPayload(values, gameName, honey.current?.value || '')),
      });
      const data = await res.json().catch(() => ({}));
      // FormSubmit answers 200 with success "false" (e.g. before activation)
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || String(res.status));
      setStatus('sent');
      track('generate_lead', { form: variant, game: gameName || '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={`booking-success booking-success--${variant}`} role="status" aria-live="polite">
        <span className="booking-success__icon">
          <Icon name="check" size={36} strokeWidth={2.5} />
        </span>
        <h2 className="booking-success__title" id={variant === 'modal' ? 'booking-title' : undefined}>Дякуємо! Заявку надіслано</h2>
        <p>Адміністратор зателефонує вам протягом доби, щоб уточнити дату й ігри.</p>
        <Button to="/games" onClick={onDone}>
          Переглянути ігри
        </Button>
      </div>
    );
  }

  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `${id(k)}-error` } : {});
  const modal = variant === 'modal';

  return (
    <form className={`booking-form booking-form--${variant}`} onSubmit={onSubmit} noValidate>
      <div className="booking-form__head">
        <Heading
          as="h2"
          id={modal ? 'booking-title' : undefined}
          title={modal ? 'Забронювати' : 'Надішліть'}
          accent={modal ? 'ігри' : 'заявку'}
          className="booking-form__title"
        />
        <p>Без передоплати. Адміністратор зателефонує протягом доби й уточнить деталі.</p>
      </div>

      <input ref={honey} type="text" name="_honey" className="visually-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="booking-form__grid">
        <Field id={id('name')} label="Ім’я" required error={errors.name}>
          <input ref={first} id={id('name')} type="text" autoComplete="name" placeholder="Як до вас звертатись" value={values.name} onChange={set('name')} {...err('name')} />
        </Field>
        <Field id={id('phone')} label="Телефон" required error={errors.phone}>
          <input id={id('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="+38 (0__) ___-__-__" value={values.phone} onChange={set('phone')} {...err('phone')} />
        </Field>
        <Field id={id('date')} label="Дата події" icon="calendar">
          <input id={id('date')} type="date" min={minDate} value={values.date} onChange={set('date')} />
        </Field>
        <Field id={id('message')} label="Коментар">
          <textarea id={id('message')} rows={3} placeholder="Які ігри вас цікавлять, формат свята, побажання щодо часу" value={values.message} onChange={set('message')} />
        </Field>
      </div>

      {status === 'error' ? (
        <p className="booking-form__error" role="alert">
          Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам: <a href={company.phoneHref}>{company.phone}</a>
        </p>
      ) : null}

      <div className="booking-form__submit">
        <Button type="submit" full disabled={status === 'sending'}>
          {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
        </Button>
        <p className="booking-form__note">Натискаючи кнопку, ви погоджуєтесь на обробку контактних даних.</p>
      </div>
    </form>
  );
}
