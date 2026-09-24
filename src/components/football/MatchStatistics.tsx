import { cn } from '@/lib/utils';
import type { MatchStatisticsRow } from '@/lib/data/match-reports';

interface MatchStatisticsProps {
  statistics: MatchStatisticsRow | null;
  homeTeamName: string;
  awayTeamName: string;
}

const STAT_ROWS: { label: string; homeKey: keyof MatchStatisticsRow; awayKey: keyof MatchStatisticsRow; suffix?: string }[] = [
  { label: 'Possession', homeKey: 'possessionHome', awayKey: 'possessionAway', suffix: '%' },
  { label: 'Shots', homeKey: 'shotsHome', awayKey: 'shotsAway' },
  { label: 'Shots on Target', homeKey: 'shotsOnTargetHome', awayKey: 'shotsOnTargetAway' },
  { label: 'Corners', homeKey: 'cornersHome', awayKey: 'cornersAway' },
  { label: 'Fouls', homeKey: 'foulsHome', awayKey: 'foulsAway' },
];

/**
 * Home/away statistic comparison bars for the match report page — "match
 * statistics (where available)." Two levels of "where available":
 * 1. No MatchStatistics row at all for the fixture -> the whole section
 *    isn't rendered (caller checks `statistics !== null` before mounting this).
 * 2. A row exists but a specific pair (e.g. corners) is still null for
 *    both sides -> that individual row is skipped, rather than showing a
 *    misleading "0 - 0".
 */
export function MatchStatistics({ statistics, homeTeamName, awayTeamName }: MatchStatisticsProps) {
  if (!statistics) return null;

  const visibleRows = STAT_ROWS.filter((row) => statistics[row.homeKey] != null || statistics[row.awayKey] != null);
  if (visibleRows.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-muted">
        <span>{homeTeamName}</span>
        <span>{awayTeamName}</span>
      </div>

      {visibleRows.map((row) => {
        const home = statistics[row.homeKey] ?? 0;
        const away = statistics[row.awayKey] ?? 0;
        const total = home + away || 1;
        const homePct = (home / total) * 100;

        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-sm font-medium text-ink">
              <span>
                {statistics[row.homeKey] ?? '—'}
                {row.suffix}
              </span>
              <span className="text-xs text-muted">{row.label}</span>
              <span>
                {statistics[row.awayKey] ?? '—'}
                {row.suffix}
              </span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div className={cn('bg-cyan')} style={{ width: `${homePct}%` }} />
              <div className={cn('bg-accent')} style={{ width: `${100 - homePct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
