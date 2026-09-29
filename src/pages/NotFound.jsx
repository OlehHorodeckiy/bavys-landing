import { Button } from '../components/ui.jsx';
import { PageHero } from '../components/sections.jsx';

export default function NotFound() {
  return (
    <PageHero
      media={{ photo: 'event-jenga', position: '80% 50%' }}
      label="404"
      title="Схоже, вежа"
      accent="впала"
      text="Такої сторінки немає. Але ігри нікуди не зникли — повертайтеся до каталогу."
      actions={
        <>
          <Button to="/games" variant="light">
            До каталогу
          </Button>
          <Button to="/" variant="outline-light">
            На головну
          </Button>
        </>
      }
    />
  );
}
