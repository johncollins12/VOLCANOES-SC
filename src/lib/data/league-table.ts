import { prisma } from '@/lib/prisma';
import { SITE_CONFIG } from '@/config/site';
import { getCurrentSeason } from './season';
import { DEMO_LEAGUE_TABLE_ROWS } from './demo-league-table';
import type { LeagueTableRow } from '@/components/football/LeagueTable';

export interface LeagueTableResult {
  rows: LeagueTableRow[];
  /** True when `rows` is illustrative demo/preview data, not real standings — every caller must show this to the visitor, not silently swap it in. */
  isDemo: boolean;
}

/**
 * Resolves which Competition's standings to show for a season when the
 * caller didn't specify one. LeagueTableEntry is scoped to
 * (seasonId, competitionId) — a season can have entries from more than
 * one competition (e.g. a league AND a cup group stage), so "just filter
 * by season" would silently mix two different tables' rows together.
 * This picks the first competition of type LEAGUE that has entries for
 * the season, which is the correct default for "the league table."
 */
async function resolvePrimaryLeagueCompetitionId(seasonId: string): Promise<string | null> {
  const entry = await prisma.leagueTableEntry.findFirst({
    where: { seasonId, competition: { type: 'LEAGUE' } },
    select: { competitionId: true },
  });
  return entry?.competitionId ?? null;
}

function toRow(e: {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}): LeagueTableRow {
  return {
    position: e.position,
    teamName: e.teamName,
    played: e.played,
    won: e.won,
    drawn: e.drawn,
    lost: e.lost,
    goalsFor: e.goalsFor,
    goalsAgainst: e.goalsAgainst,
    points: e.points,
    isOwnTeam: e.teamName === SITE_CONFIG.name,
  };
}

/**
 * A compact league table slice for the homepage: the current season's
 * top N rows (from the primary league competition — see
 * resolvePrimaryLeagueCompetitionId), plus the club's own row appended if
 * it fell outside that range, so the homepage teaser is never misleading
 * about where the club actually stands. The full, unsliced table belongs
 * to /table (getFullLeagueTable, below).
 *
 * Returns an empty array when no season is marked current, no league
 * competition has entries yet, or the query itself fails.
 */
export async function getHomeLeagueTableSnapshot(topN = 5): Promise<LeagueTableResult> {
  try {
    const currentSeason = await getCurrentSeason();
    if (!currentSeason) return { rows: DEMO_LEAGUE_TABLE_ROWS.slice(0, topN), isDemo: true };

    const competitionId = await resolvePrimaryLeagueCompetitionId(currentSeason.id);
    if (!competitionId) return { rows: DEMO_LEAGUE_TABLE_ROWS.slice(0, topN), isDemo: true };

    const entries = await prisma.leagueTableEntry.findMany({
      where: { seasonId: currentSeason.id, competitionId },
      orderBy: { position: 'asc' },
    });

    if (entries.length === 0) {
      return { rows: DEMO_LEAGUE_TABLE_ROWS.slice(0, topN), isDemo: true };
    }

    const topRows = entries.slice(0, topN).map(toRow);
    const alreadyIncluded = topRows.some((r) => r.isOwnTeam);
    const ownEntry = !alreadyIncluded ? entries.find((e) => e.teamName === SITE_CONFIG.name) : undefined;

    return { rows: ownEntry ? [...topRows, toRow(ownEntry)] : topRows, isDemo: false };
  } catch (error) {
    console.error('[getHomeLeagueTableSnapshot] failed to load table:', error);
    return { rows: DEMO_LEAGUE_TABLE_ROWS.slice(0, topN), isDemo: true };
  }
}

/**
 * The full, unsliced current-season standings for /table.
 *
 * Form (last 5 results) is only ever populated for Volcanoes FC's own
 * row — see the SCHEMA LIMITATION note on LeagueTableRow.form in
 * components/football/LeagueTable.tsx: opponents are free-text names on
 * Fixture, not linked Team records with their own fixture history, so
 * there's no reliable way to compute form for any other club in the
 * table. Every other row's `form` stays undefined rather than guessed.
 */
export async function getFullLeagueTable(competitionId?: string): Promise<LeagueTableResult> {
  try {
    const currentSeason = await getCurrentSeason();
    if (!currentSeason) return { rows: DEMO_LEAGUE_TABLE_ROWS, isDemo: true };

    const resolvedCompetitionId = competitionId ?? (await resolvePrimaryLeagueCompetitionId(currentSeason.id));
    if (!resolvedCompetitionId) return { rows: DEMO_LEAGUE_TABLE_ROWS, isDemo: true };

    const entries = await prisma.leagueTableEntry.findMany({
      where: { seasonId: currentSeason.id, competitionId: resolvedCompetitionId },
      orderBy: { position: 'asc' },
    });

    if (entries.length === 0) {
      return { rows: DEMO_LEAGUE_TABLE_ROWS, isDemo: true };
    }

    const rows = entries.map(toRow);

    const ownRow = rows.find((r) => r.isOwnTeam);
    if (ownRow) {
      const recentFixtures = await prisma.fixture.findMany({
        where: { seasonId: currentSeason.id, competitionId: resolvedCompetitionId, status: 'FULL_TIME' },
        orderBy: { kickoffAt: 'desc' },
        take: 5,
        select: { isHome: true, homeScore: true, awayScore: true },
      });

      ownRow.form = recentFixtures
        .reverse()
        .map((f): 'W' | 'D' | 'L' | null => {
          const ours = f.isHome ? f.homeScore : f.awayScore;
          const theirs = f.isHome ? f.awayScore : f.homeScore;
          if (ours == null || theirs == null) return null;
          if (ours > theirs) return 'W';
          if (ours < theirs) return 'L';
          return 'D';
        })
        .filter((r): r is 'W' | 'D' | 'L' => r !== null);
    }

    return { rows, isDemo: false };
  } catch (error) {
    console.error('[getFullLeagueTable] failed to load table:', error);
    return { rows: DEMO_LEAGUE_TABLE_ROWS, isDemo: true };
  }
}
