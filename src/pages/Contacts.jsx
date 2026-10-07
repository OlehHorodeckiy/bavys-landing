import { company } from '../data/site.js';
import { href } from '../router.js';
import Icon from '../components/Icon.jsx';
import BookingForm from '../components/BookingForm.jsx';
import { Heading, IconButton } from '../components/ui.jsx';
import { PageTitle } from '../components/sections.jsx';

const links = [
  { path: '/games', icon: 'blocks', title: 'Переглянути', accent: 'ігри', text: 'Уся колекція з правилами та деталями.' },
  { path: '/gallery', icon: 'star', title: 'Дивитися', accent: 'галерею', text: 'Живі фото ігор на наших подіях.' },
  { path: '/about', icon: 'truck', title: 'Як працює', accent: 'сервіс', text: 'Доставка, монтаж і вивіз після свята.' },
  { path: '/blog', icon: 'chat', title: 'Читати', accent: 'блог', text: 'Поради, як обрати ігри для події.' },
];

export default function Contacts() {
  return (
    <>
      <PageTitle title="Розкажіть" accent="про вашу подію" />

      <section className="section contacts">
        <div className="container contacts__grid">
          <div className="contacts__form" id="booking">
            <BookingForm variant="page" />
          </div>

          <aside className="contacts__info" aria-label="Контактна інформація">
            <ul className="contact-list" role="list">
              <li>
                <span className="contact-list__icon"><Icon name="phone" size={24} strokeWidth={1.5} /></span>
                <div>
                  <p className="contact-list__label">Телефон</p>
                  <a className="contact-list__value" href={company.phoneHref}>{company.phone}</a>
                  <p className="contact-list__note">Дзвоніть або пишіть у Telegram / Viber</p>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><Icon name="mail" size={24} strokeWidth={1.5} /></span>
                <div>
                  <p className="contact-list__label">E-mail</p>
                  <a className="contact-list__value" href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><Icon name="pin" size={24} strokeWidth={1.5} /></span>
                <div>
                  <p className="contact-list__label">Місто</p>
                  <p className="contact-list__value">{company.city}</p>
                  <p className="contact-list__note">{company.addressNote}</p>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><Icon name="clock" size={24} strokeWidth={1.5} /></span>
                <div>
                  <p className="contact-list__label">Графік роботи</p>
                  {company.hours.map((h) => (
                    <p className="contact-list__value contact-list__value--sm" key={h.label}>
                      {h.label} <span>{h.value}</span>
                    </p>
                  ))}
                </div>
              </li>
            </ul>
            <div className="contacts__socials">
              <p className="contact-list__label">Соцмережі</p>
              <div>
                {company.socials.map((s) => (
                  <IconButton key={s.id} icon={s.id} label={s.label} href={s.href} variant="brand" />
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="container">
          <ul className="quick-links" role="list">
            {links.map((l) => (
              <li key={l.path}>
                <a className="quick-link" href={href(l.path)}>
                  <span className="contact-list__icon"><Icon name={l.icon} size={22} /></span>
                  <Heading as="h2" title={l.title} accent={l.accent} className="quick-link__title" />
                  <p>{l.text}</p>
                  <Icon name="arrowUpRight" size={20} className="quick-link__arrow" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
