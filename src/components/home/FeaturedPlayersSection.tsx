import Link from 'next/link';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { buttonVariants } from '@/components/ui/Button';
import { PlayerCard } from '@/components/football/PlayerCard';
import type { PlayerSummary } from '@/lib/data/players';

interface FeaturedPlayersSectionProps {
  players: PlayerSummary[];
}

/**
 * Homepage "Featured Players" section — a responsive PlayerCard grid
 * (2 cols mobile, up to 4 on desktop) plus a "View Full Squad" link to
 * /team. See getFeaturedPlayers in src/lib/data/players.ts for how the
 * sample of players shown here is currently selected.
 */
export function FeaturedPlayersSection({ players }: FeaturedPlayersSectionProps) {
  return (
    <Section className="bg-surface-muted">
      <Container>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Featured Players</h2>
          <Link href="/team" className="hidden text-sm font-medium text-cyan hover:underline sm:inline">
            View full squad →
          </Link>
        </div>

        {players.length === 0 ? (
          <EmptyState title="Squad not published yet" description="Player profiles will appear here once the squad is added." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                name={player.name}
                jerseyNumber={player.jerseyNumber}
                position={player.position}
                nationality={player.nationality}
                photoUrl={player.photoUrl}
                href={`/team/${player.slug}`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <Link href="/team" className={buttonVariants({ variant: 'outline' })}>
            View Full Squad
          </Link>
        </div>
      </Container>
    </Section>
  );
}
