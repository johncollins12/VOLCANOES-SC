import { MatchCard } from './MatchCard';

export interface FixtureCardProps {
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date | string;
  /** Fixtures can be upcoming or currently in play — never completed (use ResultCard for that). */
  status: 'SCHEDULED' | 'LIVE';
  venueName?: string | null;
  /** Links to the fixture detail page once one exists. */
  href?: string;
  className?: string;
}

/**
 * Upcoming/live match card for the Fixtures list and homepage "Next Match"
 * strip. A thin wrapper over MatchCard that narrows the prop types so a
 * fixture literally cannot be given a final score or a FULL_TIME status —
 * MatchCard's own `status` field allows that combination, but nothing that
 * renders a *fixture* should be able to pass it.
 */
export function FixtureCard(props: FixtureCardProps) {
  return <MatchCard {...props} />;
}
