import { prisma } from '@/lib/prisma';
import { getCurrentSeason } from './season';

export interface ClubStatistics {
  matchesPlayed: number | null;
  wins: number | null;
  goalsScored: number | null;
  cleanSheets: number | null;
  /** No schema source yet — there's no Honours/Trophy model (see docs/CLUB_INFO_NEEDED.md). Always null until one exists; never a fabricated count. */
  trophies: number | null;
}

const EMPTY_STATS: ClubStatistics = {
  matchesPlayed: null,
  wins: null,
  goalsScored: null,
  cleanSheets: null,
  trophies: null,
};

/**
 * Club statistics for the homepage's "Club Statistics" section. Unlike
 * Trophies (which has no data source at all), matchesPlayed/wins/
 * goalsScored/cleanSheets ARE computed from real current-season Fixture
 * rows below — not hardcoded — so this section fills in for real the
 * moment fixtures start being recorded, rather than needing a code change.
 *
 * Every field is `number | null` rather than defaulting to 0, so the UI
 * can render an honest "—" instead of implying the club has played 0
 * matches when the truth is simply "no data yet" (see StatisticCard).
 */
export async function getClubStatistics(): Promise<ClubStatistics> {
  try {
    const currentSeason = await getCurrentSeason();
    if (!currentSeason) return EMPTY_STATS;

    const played = await prisma.fixture.findMany({
      where: { seasonId: currentSeason.id, status: 'FULL_TIME' },
      select: { isHome: true, homeScore: true, awayScore: true },
    });

    if (played.length === 0) return EMPTY_STATS;

    let wins = 0;
    let goalsScored = 0;
    let cleanSheets = 0;

    for (const match of played) {
      const ourScore = match.isHome ? match.homeScore : match.awayScore;
      const theirScore = match.isHome ? match.awayScore : match.homeScore;
      if (ourScore == null || theirScore == null) continue;

      if (ourScore > theirScore) wins++;
      goalsScored += ourScore;
      if (theirScore === 0) cleanSheets++;
    }

    return {
      matchesPlayed: played.length,
      wins,
      goalsScored,
      cleanSheets,
      trophies: null,
    };
  } catch (error) {
    console.error('[getClubStatistics] failed to compute statistics:', error);
    return EMPTY_STATS;
  }
}
