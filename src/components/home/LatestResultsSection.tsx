import Link from 'next/link';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { buttonVariants } from '@/components/ui/Button';
import { ResultCard } from '@/components/football/ResultCard';
import type { MatchSummary } from '@/lib/data/fixtures';

interface LatestResultsSectionProps {
  results: MatchSummary[];
}

/**
 * Homepage "Latest Results" section — a row of ResultCards (distinct from
 * NextMatchSection's single upcoming fixture). Only matches with
 * status FULL_TIME reach this component (see getRecentResults in
 * src/lib/data/fixtures.ts), so every card is guaranteed to have a score.
 */
export function LatestResultsSection({ results }: LatestResultsSectionProps) {
  return (
    <Section>
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Latest Results</h2>
          <Link href="/results" className="hidden text-sm font-semibold text-cyan hover:underline sm:inline">
            View All Results
          </Link>
        </div>

        {results.length === 0 ? (
          <EmptyState title="No results yet" description="Match results will appear here once played." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
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
              />
            ))}
          </div>
        )}

        <Link
          href="/results"
          className={buttonVariants({ variant: 'outline', className: 'mt-6 w-full sm:hidden' })}
        >
          View All Results
        </Link>
      </Container>
    </Section>
  );
}
