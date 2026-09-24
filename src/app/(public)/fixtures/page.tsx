import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { FixtureCard } from '@/components/football/FixtureCard';
import { CompetitionFilter } from '@/components/football/CompetitionFilter';
import { getUpcomingFixturesList, getCompetitions } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Fixtures',
  description: 'Upcoming SC Volcanoes fixtures — competition, opponent, venue, and kickoff time.',
  path: '/fixtures',
});

interface FixturesPageProps {
  searchParams: Promise<{ page?: string; competition?: string }>;
}

/**
 * /fixtures — paginated, competition-filterable list of upcoming/live
 * fixtures. Filter and page state both live in the URL (see
 * CompetitionFilter and URLPagination), read here via `searchParams`, so
 * this stays a plain Server Component with no client-side data fetching
 * of its own.
 */
export default async function FixturesPage({ searchParams }: FixturesPageProps) {
  const { page: pageParam, competition } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [fixtures, competitions] = await Promise.all([
    getUpcomingFixturesList({ page, pageSize: 12, competitionId: competition }),
    getCompetitions(),
  ]);

  return (
    <Section>
      <Container>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold text-ink">Fixtures</h1>
          <CompetitionFilter competitions={competitions} />
        </div>
        <p className="mb-6 text-sm text-muted">Upcoming matches and matchday information.</p>

        {fixtures.items.length === 0 ? (
          <EmptyState
            title="No upcoming fixtures"
            description={
              competition
                ? 'No fixtures found for this competition. Try a different filter.'
                : 'The fixture list will appear here once matches are scheduled from the admin dashboard.'
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fixtures.items.map((fixture) => (
                <FixtureCard
                  key={fixture.id}
                  competitionName={fixture.competitionName}
                  homeTeamName={fixture.homeTeamName}
                  awayTeamName={fixture.awayTeamName}
                  isHome={fixture.isHome}
                  kickoffAt={fixture.kickoffAt}
                  status={fixture.status === 'LIVE' ? 'LIVE' : 'SCHEDULED'}
                  venueName={fixture.venueName}
                  href={`/fixtures/${fixture.id}`}
                />
              ))}
            </div>

            {fixtures.totalPages > 1 && (
              <URLPagination page={fixtures.page} totalPages={fixtures.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
