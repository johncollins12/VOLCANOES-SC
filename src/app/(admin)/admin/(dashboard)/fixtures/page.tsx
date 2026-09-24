import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { CompetitionFilter } from '@/components/football/CompetitionFilter';
import { getAdminFixturesList, getCompetitions } from '@/lib/data';
import { FixturesTable } from './FixturesTable';

interface AdminFixturesPageProps {
  searchParams: Promise<{ page?: string; competition?: string }>;
}

export default async function AdminFixturesPage({ searchParams }: AdminFixturesPageProps) {
  const { page: pageParam, competition } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [fixtures, competitions] = await Promise.all([
    getAdminFixturesList({ page, pageSize: 15, competitionId: competition }),
    getCompetitions(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Fixtures & Results</h1>
        <Link href="/admin/fixtures/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Fixture
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <CompetitionFilter competitions={competitions} />
      </div>

      <FixturesTable items={fixtures.items} />

      <URLPagination page={fixtures.page} totalPages={fixtures.totalPages} className="mt-4" />
    </div>
  );
}