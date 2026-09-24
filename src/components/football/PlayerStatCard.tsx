import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface PlayerStatCardProps {
  name: string;
  jerseyNumber?: number | null;
  position?: string | null;
  photoUrl?: string | null;
  seasonLabel: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  className?: string;
}

/**
 * A player's season statistics line — used on the player profile page and
 * "Top Scorers"/"Top Assists" leaderboard widgets. Distinct from PlayerCard
 * (which is the squad-grid teaser with no numbers): this component's whole
 * purpose is the stat row, so it always shows one, whereas PlayerCard never
 * does.
 */
export function PlayerStatCard({
  name,
  jerseyNumber,
  position,
  photoUrl,
  seasonLabel,
  appearances,
  goals,
  assists,
  yellowCards,
  redCards,
  className,
}: PlayerStatCardProps) {
  return (
    <div className={cn('flex items-center gap-4 rounded-card border border-border bg-surface p-4 shadow-card', className)}>
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-charcoal">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm font-semibold text-white/40" aria-hidden>
            {jerseyNumber ?? '—'}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-muted">
          {position ?? 'Position pending'} · {seasonLabel}
        </p>
      </div>

      <dl className="flex shrink-0 items-center gap-4 font-mono text-sm tabular-nums">
        <Stat label="Apps" value={appearances} />
        <Stat label="Goals" value={goals} highlight />
        <Stat label="Assists" value={assists} />
        {(yellowCards > 0 || redCards > 0) && (
          <div className="flex items-center gap-1.5">
            {yellowCards > 0 && (
              <span
                className="rounded-sm border border-border px-1 text-[10px] font-bold text-muted"
                title={`${yellowCards} yellow card${yellowCards > 1 ? 's' : ''}`}
              >
                {yellowCards}Y
              </span>
            )}
            {redCards > 0 && (
              <span
                className="rounded-sm bg-accent px-1 text-[10px] font-bold text-white"
                title={`${redCards} red card${redCards > 1 ? 's' : ''}`}
              >
                {redCards}R
              </span>
            )}
          </div>
        )}
      </dl>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <dt className="text-[10px] font-sans uppercase tracking-wide text-muted">{label}</dt>
      <dd className={cn('font-semibold', highlight ? 'text-accent' : 'text-ink')}>{value}</dd>
    </div>
  );
}
