import { useMemo, useState } from 'react';
import { games } from '../data/games.js';
import { company, eventTypes } from '../data/site.js';
import Icon from './Icon.jsx';
import { Button, Heading, Pill } from './ui.jsx';

/**
 * Booking request form. The primary conversion of the whole site:
 * request → company inbox → administrator calls the customer back.
 *
 * Delivery: if VITE_FORM_ENDPOINT is set (Formspree, Web3Forms, a Google Apps
 * Script webhook — anything that accepts a JSON POST and forwards it to Gmail),
 * the request is posted there. Without it the form falls back to opening the
 * visitor's mail app with the request pre-filled to company.email.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

const guestOptions = ['до 30', '30–60', '60–100', '100–200', '200+'];
const typeOptions = [...eventTypes.filter((t) => t.id !== 'outdoor').map((t) => t.label), 'Інше'];

const today = () => new Date().toISOString().slice(0, 10);

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Вкажіть, як до вас звертатися';
  if (v.phone.replace(/\D/g, '').length < 10) errors.phone = 'Вкажіть номер телефону, щоб ми могли зателефонувати';
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) errors.email = 'Перевірте адресу e-mail';
  return errors;
}

function toText(v, selected) {
  const names = games.filter((g) => selected.includes(g.slug)).map((g) => g.name);
  return [
    `Ім'я: ${v.name}`,
    `Телефон: ${v.phone}`,
    `E-mail: ${v.email || '—'}`,
    `Тип події: ${v.type || '—'}`,
    `Дата: ${v.date || '—'}`,
    `Локація: ${v.location || '—'}`,
    `Кількість гостей: ${v.guests || '—'}`,
    `Обрані ігри: ${names.length ? names.join(', ') : 'допоможіть обрати'}`,
    '',
    v.message || '',
  ].join('\n');
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

export default function BookingForm({ initialGame }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', type: '', date: '', location: '', guests: '', message: '' });
  const [selected, setSelected] = useState(() => (initialGame ? [initialGame] : []));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggle = (slug) => setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  const selectedNames = useMemo(() => games.filter((g) => selected.includes(g.slug)).map((g) => g.name), [selected]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`bf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const subject = `Заявка на оренду ігор — ${values.name}`;
    const body = toText(values, selected);

    if (ENDPOINT) {
      setStatus('sending');
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ subject, ...values, games: selectedNames, message_text: body }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
      } catch {
        setStatus('error');
      }
      return;
    }

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="booking-success" role="status" aria-live="polite">
        <span className="booking-success__icon">
          <Icon name="check" size={32} strokeWidth={2} />
        </span>
        <Heading as="h2" title="Дякуємо!" accent="Заявку отримано" br className="booking-success__title" />
        <p>
          Ваша заявка надійшла до нас. Адміністратор зв’яжеться з вами найближчим часом, щоб уточнити деталі й підтвердити
          наявність ігор на вашу дату.
        </p>
        {selectedNames.length ? (
          <p className="booking-success__games">
            <strong>Обрані ігри:</strong> {selectedNames.join(', ')}
          </p>
        ) : null}
        <div className="booking-success__actions">
          <Button to="/games">Переглянути ще ігри</Button>
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Змінити заявку
          </Button>
        </div>
      </div>
    );
  }

  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `bf-${k}-error` } : {});

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="booking-form__head">
        <Pill tone="white">Заявка</Pill>
        <Heading as="h2" title="Надішліть" accent="заявку" className="booking-form__title" />
        <p>Без передоплати. Адміністратор зателефонує протягом доби, підбере ігри та підтвердить бронь.</p>
      </div>

      <div className="booking-form__grid">
        <Field id="bf-name" label="Ім’я" required error={errors.name}>
          <input id="bf-name" type="text" autoComplete="name" value={values.name} onChange={set('name')} {...err('name')} />
        </Field>
        <Field id="bf-phone" label="Телефон" required error={errors.phone}>
          <input id="bf-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+38 (0__) ___-__-__" value={values.phone} onChange={set('phone')} {...err('phone')} />
        </Field>
        <Field id="bf-email" label="E-mail" error={errors.email}>
          <input id="bf-email" type="email" autoComplete="email" value={values.email} onChange={set('email')} {...err('email')} />
        </Field>
        <Field id="bf-type" label="Тип події">
          <div className="select">
            <select id="bf-type" value={values.type} onChange={set('type')}>
              <option value="">Оберіть тип події</option>
              {typeOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <Icon name="arrowRight" size={16} className="select__icon" />
          </div>
        </Field>
        <Field id="bf-date" label="Дата події">
          <input id="bf-date" type="date" min={today()} value={values.date} onChange={set('date')} />
        </Field>
        <Field id="bf-guests" label="Кількість гостей">
          <div className="select">
            <select id="bf-guests" value={values.guests} onChange={set('guests')}>
              <option value="">Орієнтовно</option>
              {guestOptions.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <Icon name="arrowRight" size={16} className="select__icon" />
          </div>
        </Field>
        <Field id="bf-location" label="Локація" hint="Місто, заклад або адреса">
          <input id="bf-location" type="text" placeholder="Львів, ресторан / заміський комплекс" value={values.location} onChange={set('location')} />
        </Field>
      </div>

      <fieldset className="field game-picker">
        <legend className="field__label">
          Обрані ігри <span className="game-picker__count">{selected.length ? `· ${selected.length}` : ''}</span>
        </legend>
        <div className="game-picker__list">
          {games.map((g) => {
            const on = selected.includes(g.slug);
            return (
              <button key={g.slug} type="button" className={`game-picker__item ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(g.slug)}>
                <Icon name={on ? 'check' : 'plus'} size={16} strokeWidth={2} />
                {g.name}
              </button>
            );
          })}
        </div>
        <p className="field__hint">Не впевнені? Залиште порожнім — адміністратор допоможе обрати.</p>
      </fieldset>

      <Field id="bf-message" label="Додаткова інформація">
        <textarea id="bf-message" rows={5} placeholder="Формат свята, вік гостей, побажання щодо таймінгу…" value={values.message} onChange={set('message')} />
      </Field>

      {status === 'error' ? (
        <p className="booking-form__error" role="alert">
          Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам: <a href={company.phoneHref}>{company.phone}</a>
        </p>
      ) : null}

      <div className="booking-form__submit">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
        </Button>
        <p className="booking-form__note">Натискаючи кнопку, ви погоджуєтесь на обробку контактних даних для зворотного зв’язку.</p>
      </div>
    </form>
  );
}
