import Link from 'next/link';
import { formatDisplayDate, formatKickoffTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MatchStatusBadge, type MatchStatus } from './MatchStatusBadge';

export type { MatchStatus };

export interface MatchCardProps {
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date | string;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  venueName?: string | null;
  /** When provided, the whole card becomes a link (fixture/result detail page, or a match report once published). */
  href?: string;
  className?: string;
}

/**
 * The core component behind both fixtures and results — a fixture is just
 * a match card whose status is SCHEDULED/LIVE instead of FULL_TIME. Keeping
 * one implementation avoids fixtures/results drifting apart visually.
 *
 * Most call sites should use the narrower `FixtureCard` or `ResultCard`
 * wrappers (in this same folder) instead of this directly — they constrain
 * the props to what actually makes sense for each context (a fixture can't
 * have a score; a result must have one), which this component's status
 * field alone doesn't enforce at the type level.
 */
export function MatchCard({
  competitionName,
  homeTeamName,
  awayTeamName,
  isHome,
  kickoffAt,
  status,
  homeScore,
  awayScore,
  venueName,
  href,
  className,
}: MatchCardProps) {
  const played = status === 'FULL_TIME' || status === 'LIVE';

  const content = (
    <div
      className={cn(
        'rounded-card border border-border bg-surface p-4 shadow-card',
        href && 'hover-lift',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-2 truncate">
          <span className="truncate">{competitionName}</span>
          <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
            {isHome ? 'Home' : 'Away'}
          </span>
        </span>
        <MatchStatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <TeamRow name={homeTeamName} />
        <div className="flex flex-col items-center px-2">
          {played ? (
            <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
              {homeScore ?? 0}–{awayScore ?? 0}
            </span>
          ) : (
            <span className="font-mono text-lg font-semibold text-muted">{formatKickoffTime(kickoffAt)}</span>
          )}
          {!played && <span className="mt-0.5 text-[11px] text-muted">{formatDisplayDate(kickoffAt)}</span>}
        </div>
        <TeamRow name={awayTeamName} align="right" />
      </div>

      {venueName && <p className="mt-3 text-center text-xs text-muted">{venueName}</p>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
        {content}
      </Link>
    );
  }

  return content;
}

function TeamRow({ name, align = 'left' }: { name: string; align?: 'left' | 'right' }) {
  return (
    <div className={cn('flex flex-1 items-center gap-2', align === 'right' && 'flex-row-reverse text-right')}>
      {/* Crest placeholder — swap for real opponent badges once available */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-semibold text-muted">
        {name.slice(0, 3).toUpperCase()}
      </span>
      <span className="truncate text-sm font-medium text-ink">{name}</span>
    </div>
  );
}
