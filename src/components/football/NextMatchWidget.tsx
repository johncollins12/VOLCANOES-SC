import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { formatDisplayDate, formatKickoffTime, cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

export interface NextMatchWidgetProps {
  competitionName: string;
  opponentName: string;
  isHome: boolean;
  kickoffAt: Date | string;
  venueName?: string | null;
  ticketsHref?: string;
  className?: string;
}

/**
 * Compact "next match" tile for sidebars, the news article page rail, and
 * the admin dashboard — distinct from the homepage's full-width
 * NextMatchSection (which pairs a MatchCard with a ResultCard side by
 * side). This is a single narrow column: opponent, date/time, venue, and
 * an optional tickets CTA — no score display, since it's for a fixture
 * that hasn't happened yet by definition.
 */
export function NextMatchWidget({
  competitionName,
  opponentName,
  isHome,
  kickoffAt,
  venueName,
  ticketsHref,
  className,
}: NextMatchWidgetProps) {
  return (
    <div className={cn('rounded-card border border-border bg-surface p-4 shadow-card', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Next Match</p>
      <p className="mt-2 font-display text-lg font-semibold text-ink">
        {isHome ? 'SC Volcanoes' : opponentName} <span className="text-muted">vs</span>{' '}
        {isHome ? opponentName : 'SC Volcanoes'}
      </p>
      <p className="text-xs text-muted">{competitionName}</p>

      <dl className="mt-3 flex flex-col gap-1.5 text-sm text-ink">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <dt className="sr-only">Kickoff</dt>
          <dd>
            {formatDisplayDate(kickoffAt)} · {formatKickoffTime(kickoffAt)}
          </dd>
        </div>
        {venueName && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            <dt className="sr-only">Venue</dt>
            <dd>{venueName}</dd>
          </div>
        )}
      </dl>

      {ticketsHref && (
        <Link href={ticketsHref} className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'mt-4 w-full')}>
          Buy Tickets
        </Link>
      )}
    </div>
  );
}
