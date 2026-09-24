import { Badge } from '@/components/ui/Badge';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FULL_TIME' | 'POSTPONED' | 'CANCELLED';

const STATUS_LABEL: Record<MatchStatus, string> = {
  SCHEDULED: 'Upcoming',
  LIVE: 'Live',
  FULL_TIME: 'FT',
  POSTPONED: 'Postponed',
  CANCELLED: 'Cancelled',
};

/**
 * The status pill used on every match-related card (MatchCard, FixtureCard,
 * ResultCard, TeamLineupCard headers). Extracted as its own component so
 * fixture status is styled in exactly one place — a LIVE match looks
 * identical everywhere it appears in the app.
 */
export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  switch (status) {
    case 'LIVE':
      return (
        <Badge variant="live" dot>
          {STATUS_LABEL[status]}
        </Badge>
      );
    case 'FULL_TIME':
      return <Badge variant="success">{STATUS_LABEL[status]}</Badge>;
    case 'SCHEDULED':
      return <Badge variant="default">{STATUS_LABEL[status]}</Badge>;
    default:
      return <Badge variant="muted">{STATUS_LABEL[status]}</Badge>;
  }
}
