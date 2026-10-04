import { Button, Heading, Media } from '../components/ui.jsx';

/** 404: «4 [falling Jenga tower] 4» on the white + lawn backdrop. */
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__bg" aria-hidden="true">
        <Media photo="lawn-strip" alt="" eager />
      </div>
      <div className="container not-found__inner">
        <div className="not-found__code" role="img" aria-label="404">
          <span aria-hidden="true">4</span>
          <span className="not-found__tower" aria-hidden="true">
            <Media photo="jenga-404" alt="" eager />
          </span>
          <span aria-hidden="true">4</span>
        </div>
        <Heading as="h1" title="Схоже, вежа" accent="впала" className="not-found__title" />
        <p className="not-found__text">Такої сторінки немає. Але ігри нікуди не зникли, повертайтеся до каталогу.</p>
        <div className="not-found__actions">
          <Button to="/games">До каталогу</Button>
          <Button to="/" variant="outline" disc={false}>
            На головну
          </Button>
        </div>
      </div>
    </section>
  );
}
