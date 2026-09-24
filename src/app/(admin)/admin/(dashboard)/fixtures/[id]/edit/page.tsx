import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Breadcrumb } from '@/components/cms/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { getCompetitions, getVenues, getSeasonOptions, getFixtureById } from '@/lib/data';
import { updateFixtureAction } from '@/actions/fixtures.actions';
import { FixtureForm } from '../../FixtureForm';

interface EditFixturePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFixturePage({ params }: EditFixturePageProps) {
  const { id } = await params;
  const [competitions, venues, seasons, fixture] = await Promise.all([
    getCompetitions(),
    getVenues(),
    getSeasonOptions(),
    getFixtureById(id),
  ]);

  if (!fixture) notFound();

  return (
    <div>
      <Breadcrumb
        items={[{ label: 'Fixtures & Results', href: '/admin/fixtures' }, { label: `${fixture.homeTeamName} vs ${fixture.awayTeamName}` }]}
      />
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">Edit Fixture</h1>
        {fixture.status === 'FULL_TIME' && (
          <Link href={`/admin/match-reports/${fixture.id}/edit`}>
            <Button variant="outline">
              <FileText className="h-4 w-4" aria-hidden />
              Manage Match Report
            </Button>
          </Link>
        )}
      </div>
      <FixtureForm
        seasons={seasons}
        competitions={competitions}
        venues={venues}
        fixture={fixture}
        action={updateFixtureAction.bind(null, id)}
      />
    </div>
  );
}
