import { findEvent } from '../data/events.js';
import { EventFaq, EventGallery, EventHero, EventMoments, EventPackages, EventPicks, EventRequest } from '../components/event-sections.jsx';
import NotFound from './NotFound.jsx';

/**
 * One event (/podii/:slug): the arch first screen, three moments, games picked for the event,
 * the four packages, real photos, the event's own questions and the request form.
 */
export default function Event({ slug }) {
  const page = findEvent(slug);
  if (!page) return <NotFound />;
  return (
    <>
      <EventHero page={page} />
      <EventMoments page={page} />
      <EventPicks page={page} />
      <EventPackages page={page} />
      <EventGallery page={page} />
      <EventFaq page={page} />
      <EventRequest page={page} />
    </>
  );
}
