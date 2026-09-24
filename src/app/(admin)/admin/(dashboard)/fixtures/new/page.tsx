import { Breadcrumb } from '@/components/cms/Breadcrumb';
import { getCompetitions, getVenues, getSeasonOptions } from '@/lib/data';
import { createFixtureAction } from '@/actions/fixtures.actions';
import { FixtureForm } from '../FixtureForm';

export default async function NewFixturePage() {
  const [competitions, venues, seasons] = await Promise.all([getCompetitions(), getVenues(), getSeasonOptions()]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Fixtures & Results', href: '/admin/fixtures' }, { label: 'New' }]} />
      <h1 className="mb-6 mt-2 font-display text-2xl text-ink">New Fixture</h1>
      <FixtureForm seasons={seasons} competitions={competitions} venues={venues} action={createFixtureAction} />
    </div>
  );
}
