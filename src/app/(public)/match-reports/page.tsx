import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { ResultCard } from '@/components/football/ResultCard';
import { getMatchReportsList } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Match Reports',
  description: 'In-depth match reports from SC Volcanoes fixtures.',
  path: '/match-reports',
});

interface MatchReportsPageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * /match-reports — published reports, most recent match first. Reuses
 * ResultCard (each report is inherently tied to a completed fixture with
 * a real scoreline) rather than a bespoke "report card," since the
 * summary information is identical to a result — only the destination
 * (the report itself, not /results) differs.
 */
export default async function MatchReportsPage({ searchParams }: MatchReportsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const reports = await getMatchReportsList({ page, pageSize: 9 });

  return (
    <Section>
      <Container>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Match Reports</h1>
        <p className="mb-6 text-sm text-muted">Detailed coverage of completed matches.</p>

        {reports.items.length === 0 ? (
          <EmptyState
            title="No match reports yet"
            description="In-depth reports will appear here once published from the admin dashboard."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.items.map((report) => (
                <ResultCard
                  key={report.fixtureId}
                  competitionName={report.competitionName}
                  homeTeamName={report.homeTeamName}
                  awayTeamName={report.awayTeamName}
                  isHome={report.isHome}
                  kickoffAt={report.kickoffAt}
                  homeScore={report.homeScore ?? 0}
                  awayScore={report.awayScore ?? 0}
                  href={`/match-reports/${report.fixtureId}`}
                />
              ))}
            </div>

            {reports.totalPages > 1 && (
              <URLPagination page={reports.page} totalPages={reports.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
