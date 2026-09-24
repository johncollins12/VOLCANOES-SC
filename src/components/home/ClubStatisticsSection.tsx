import { Section, Container } from '@/components/ui/Container';
import { StatisticCard } from '@/components/ui/StatisticCard';
import type { ClubStatistics } from '@/lib/data/statistics';

interface ClubStatisticsSectionProps {
  statistics: ClubStatistics;
}

/**
 * Homepage "Club Statistics" section — five StatisticCard tiles, reused
 * as-is (no dark/charcoal variant introduced here, so this stays a plain
 * surface-muted band rather than requiring a one-off restyle of a shared
 * component). Values come from getClubStatistics()
 * (src/lib/data/statistics.ts): matches played/wins/goals/clean sheets are
 * computed from real current-season fixture data once it exists, while
 * Trophies has no schema source yet and always shows "—" via
 * StatisticCard's own placeholder convention, rather than a fabricated
 * number.
 */
export function ClubStatisticsSection({ statistics }: ClubStatisticsSectionProps) {
  return (
    <Section className="bg-surface-muted">
      <Container>
        <h2 className="mb-6 text-center font-display text-2xl font-semibold text-ink">Club Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatisticCard label="Matches Played" value={statistics.matchesPlayed ?? '—'} />
          <StatisticCard label="Wins" value={statistics.wins ?? '—'} />
          <StatisticCard label="Goals Scored" value={statistics.goalsScored ?? '—'} />
          <StatisticCard label="Clean Sheets" value={statistics.cleanSheets ?? '—'} />
          <StatisticCard label="Trophies" value={statistics.trophies ?? '—'} />
        </div>
      </Container>
    </Section>
  );
}
