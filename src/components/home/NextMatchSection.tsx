import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { MatchCard } from '@/components/football/MatchCard';
import { MatchCountdown } from '@/components/football/MatchCountdown';
import type { MatchSummary } from '@/lib/data/fixtures';

interface NextMatchSectionProps {
  nextFixture: MatchSummary | null;
}

/**
 * Homepage "Next Match" section: competition, opponent, venue, kickoff,
 * status, and a live countdown — all sourced from the one upcoming/live
 * MatchSummary passed down from app/(public)/page.tsx (src/lib/data/fixtures.ts).
 * Latest results now live in their own LatestResultsSection, separate from
 * this one, matching the approved homepage section order.
 */
export function NextMatchSection({ nextFixture }: NextMatchSectionProps) {
  return (
    <Section className="bg-surface-muted">
      <Container>
        <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Next Match</h2>

        {nextFixture ? (
          <div className="mx-auto max-w-md">
            <MatchCard
              competitionName={nextFixture.competitionName}
              homeTeamName={nextFixture.homeTeamName}
              awayTeamName={nextFixture.awayTeamName}
              isHome={nextFixture.isHome}
              kickoffAt={nextFixture.kickoffAt}
              status={nextFixture.status}
              venueName={nextFixture.venueName}
            />
            {nextFixture.status === 'SCHEDULED' && (
              <MatchCountdown kickoffAt={nextFixture.kickoffAt} className="mt-4" />
            )}
          </div>
        ) : (
          <EmptyState
            title="No upcoming fixture"
            description="The next match will appear here once it's added to the schedule."
          />
        )}
      </Container>
    </Section>
  );
}
