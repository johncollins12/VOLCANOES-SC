import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { ResultCard } from '@/components/football/ResultCard';
import { CompetitionFilter } from '@/components/football/CompetitionFilter';
import { getResultsList, getCompetitions } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Results',
  description: 'Recent SC Volcanoes match results and scorelines.',
  path: '/results',
});

interface ResultsPageProps {
  searchParams: Promise<{ page?: string; competition?: string }>;
}

/**
 * /results — paginated, competition-filterable list of completed
 * fixtures, most recent first. Same URL-state pattern as /fixtures (see
 * that page's comments) — filter and page both live in the URL.
 *
 * Match report links: ResultCard's `href` points to /match-reports/[id]
 * for now (the architecture's planned route for a published report on a
 * given fixture — see the folder structure in the architecture doc). No
 * match reports exist yet, so that route 404s until a later phase (News &
 * Media) builds it; the link itself is still correct to ship now per the
 * requested "Match report links" requirement, rather than omitting it.
 */
export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { page: pageParam, competition } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [results, competitions] = await Promise.all([
    getResultsList({ page, pageSize: 12, competitionId: competition }),
    getCompetitions(),
  ]);

  return (
    <Section>
      <Container>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold text-ink">Results</h1>
          <CompetitionFilter competitions={competitions} />
        </div>
        <p className="mb-6 text-sm text-muted">Follow every result from SC Volcanoes.</p>

        {results.items.length === 0 ? (
          <EmptyState
            title="No results yet"
            description={
              competition
                ? 'No results found for this competition. Try a different filter.'
                : 'Match results will appear here once games have been played and recorded.'
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.items.map((result) => (
                <ResultCard
                  key={result.id}
                  competitionName={result.competitionName}
                  homeTeamName={result.homeTeamName}
                  awayTeamName={result.awayTeamName}
                  isHome={result.isHome}
                  kickoffAt={result.kickoffAt}
                  homeScore={result.homeScore ?? 0}
                  awayScore={result.awayScore ?? 0}
                  venueName={result.venueName}
                  href={`/match-reports/${result.id}`}
                />
              ))}
            </div>

            {results.totalPages > 1 && (
              <URLPagination page={results.page} totalPages={results.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
