import { MatchCard } from './MatchCard';

export interface ResultCardProps {
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date | string;
  /** A result is, by definition, required — this is what distinguishes it from FixtureCard. */
  homeScore: number;
  awayScore: number;
  venueName?: string | null;
  /** Links to the match report once one is published for this fixture. */
  href?: string;
  className?: string;
}

/**
 * Completed-match card for the Results list and homepage "Latest Result"
 * card. Wraps MatchCard with `status` fixed to `FULL_TIME` and scores made
 * required (rather than optional, as they are on MatchCard) — a result
 * without a score would be a data-entry bug, and this makes that
 * unrepresentable at the type level instead of just a runtime check.
 */
export function ResultCard(props: ResultCardProps) {
  return <MatchCard {...props} status="FULL_TIME" />;
}
