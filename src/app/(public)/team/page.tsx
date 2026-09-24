import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { SquadGrid } from '@/components/football/SquadGrid';
import { EmptyState } from '@/components/ui/Feedback';
import { getFullSquad, getSquadOverview, getCurrentSeason } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Squad',
  description: 'The full Volcanoes FC squad — players, positions, and profiles.',
  path: '/team',
});

/**
 * /team — squad overview, position filter + search (SquadGrid), and squad
 * statistics. Player data is fetched once here and handed down; SquadGrid
 * itself does client-side filtering only, no data fetching of its own.
 */
export default async function TeamPage() {
  const [players, overview, currentSeason] = await Promise.all([
    getFullSquad(),
    getSquadOverview(),
    getCurrentSeason(),
  ]);

  return (
    <Section>
      <Container>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-3xl font-semibold text-ink">Players</h1>
          {currentSeason && <span className="text-sm text-muted">{currentSeason.label}</span>}
        </div>
        <p className="mb-1 text-sm text-muted">Meet the Volcanoes FC squad.</p>
        <p className="mb-8 max-w-2xl text-sm text-muted">
          {overview.totalPlayers > 0
            ? `${overview.totalPlayers} players across the squad — filter by position or search by name below.`
            : 'The squad list will appear here once players are added from the admin dashboard.'}
        </p>

        {overview.totalPlayers > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatisticCard label="Total Players" value={overview.totalPlayers} />
            <StatisticCard label="Goalkeepers" value={overview.goalkeepers} />
            <StatisticCard label="Defenders" value={overview.defenders} />
            <StatisticCard label="Midfielders" value={overview.midfielders} />
            <StatisticCard label="Forwards" value={overview.forwards} />
            <StatisticCard label="Average Age" value={overview.averageAge ?? '—'} />
          </div>
        )}

        {players.length === 0 ? (
          <EmptyState
            title="Squad not published yet"
            description="Player profiles will appear here once the squad is added from the admin dashboard."
          />
        ) : (
          <SquadGrid players={players} />
        )}
      </Container>
    </Section>
  );
}
