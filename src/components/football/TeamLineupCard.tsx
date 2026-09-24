import { cn } from '@/lib/utils';

export interface LineupPlayer {
  jerseyNumber: number;
  name: string;
  position?: string | null;
}

export interface TeamLineupCardProps {
  teamName: string;
  formation?: string | null;
  startingXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  className?: string;
}

/**
 * Starting XI + substitutes for a match report or live match centre.
 * Deliberately a simple list (not a pitch-graphic formation diagram) —
 * a visual formation layout is a reasonable future enhancement, but adds
 * real complexity (positioning math, responsive collapse) for a feature
 * that doesn't exist yet (match reports are Phase 3+); this ships the
 * data in a fully responsive, screen-reader-friendly form now.
 */
export function TeamLineupCard({ teamName, formation, startingXI, substitutes, className }: TeamLineupCardProps) {
  return (
    <div className={cn('rounded-card border border-border bg-surface p-4 shadow-card', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">{teamName}</h3>
        {formation && (
          <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-xs text-muted">{formation}</span>
        )}
      </div>

      <section aria-label="Starting XI">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Starting XI</p>
        <ol className="mb-4 flex flex-col gap-1.5">
          {startingXI.map((player) => (
            <PlayerRow key={player.jerseyNumber} player={player} />
          ))}
        </ol>
      </section>

      {substitutes.length > 0 && (
        <section aria-label="Substitutes">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Substitutes</p>
          <ol className="flex flex-col gap-1.5">
            {substitutes.map((player) => (
              <PlayerRow key={player.jerseyNumber} player={player} muted />
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

function PlayerRow({ player, muted }: { player: LineupPlayer; muted?: boolean }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold',
          muted ? 'bg-surface-muted text-muted' : 'bg-charcoal text-white'
        )}
      >
        {player.jerseyNumber}
      </span>
      <span className={cn('truncate', muted ? 'text-muted' : 'text-ink')}>{player.name}</span>
      {player.position && <span className="ml-auto shrink-0 text-xs text-muted">{player.position}</span>}
    </li>
  );
}
