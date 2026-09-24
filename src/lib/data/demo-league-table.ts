import type { LeagueTableRow } from '@/components/football/LeagueTable';

/**
 * DEMO / PREVIEW DATA — NOT real, verified, or current standings.
 *
 * Used ONLY as a visual fallback on the public League Table (both the
 * homepage snapshot and the full /table page) when the real database has
 * no LeagueTableEntry rows yet for the current season — i.e. before any
 * admin has entered a single result. The moment real standings exist,
 * getFullLeagueTable()/getHomeLeagueTableSnapshot() (src/lib/data/league-table.ts)
 * return real rows instead and this file is never touched.
 *
 * Team names: SC Volcanoes (this club) plus a set of real, publicly
 * known FUFA Big League clubs (Uganda's second tier) — Kiyinda Boys FC,
 * Paidha Black Angels, and Iganga United FC were specifically requested;
 * Kataka FC, Calvary FC, Busoga United, and Ndejje University FC are
 * other clubs that have competed in the Big League. Using real club
 * names (rather than invented ones) makes the demo table look like a
 * genuine Big League table — but the PLACEMENT, POINTS, and RECORD shown
 * for every club here (SC Volcanoes included) are entirely illustrative
 * and must never be presented as those clubs' actual current standings.
 * Every page that renders this array MUST show a visible "demo/preview
 * data" notice alongside it — see the `isDemo` flag returned by the
 * functions in league-table.ts, which callers use to render that notice.
 */
export const DEMO_LEAGUE_TABLE_ROWS: LeagueTableRow[] = [
  { position: 1, teamName: 'Kataka FC', played: 18, won: 13, drawn: 3, lost: 2, goalsFor: 34, goalsAgainst: 14, points: 42 },
  { position: 2, teamName: 'Busoga United', played: 18, won: 12, drawn: 4, lost: 2, goalsFor: 30, goalsAgainst: 16, points: 40 },
  {
    position: 3,
    teamName: 'SC Volcanoes',
    played: 18,
    won: 11,
    drawn: 4,
    lost: 3,
    goalsFor: 29,
    goalsAgainst: 17,
    points: 37,
    isOwnTeam: true,
    form: ['W', 'D', 'W', 'L', 'W'],
  },
  { position: 4, teamName: 'Ndejje University FC', played: 18, won: 10, drawn: 5, lost: 3, goalsFor: 27, goalsAgainst: 18, points: 35 },
  { position: 5, teamName: 'Iganga United FC', played: 18, won: 9, drawn: 6, lost: 3, goalsFor: 24, goalsAgainst: 19, points: 33 },
  { position: 6, teamName: 'Calvary FC', played: 18, won: 8, drawn: 5, lost: 5, goalsFor: 22, goalsAgainst: 20, points: 29 },
  { position: 7, teamName: 'Kiyinda Boys FC', played: 18, won: 6, drawn: 6, lost: 6, goalsFor: 19, goalsAgainst: 21, points: 24 },
  { position: 8, teamName: 'Paidha Black Angels (PBA)', played: 18, won: 4, drawn: 5, lost: 9, goalsFor: 15, goalsAgainst: 28, points: 17 },
];
