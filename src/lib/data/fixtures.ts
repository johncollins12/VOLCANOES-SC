import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginationParams, PaginatedResult } from '@/types';
import type { MatchStatus } from '@/components/football/MatchCard';

export interface MatchSummary {
  id: string;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  venueName: string | null;
}

const MATCH_SELECT = {
  id: true,
  homeTeamName: true,
  awayTeamName: true,
  isHome: true,
  kickoffAt: true,
  status: true,
  homeScore: true,
  awayScore: true,
  competition: { select: { name: true } },
  venue: { select: { name: true } },
} as const;

function toMatchSummary(
  row: {
    id: string;
    homeTeamName: string;
    awayTeamName: string;
    isHome: boolean;
    kickoffAt: Date;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    competition: { name: string } | null;
    venue: { name: string } | null;
  }
): MatchSummary {
  return {
    id: row.id,
    competitionName: row.competition?.name ?? 'Friendly',
    homeTeamName: row.homeTeamName,
    awayTeamName: row.awayTeamName,
    isHome: row.isHome,
    kickoffAt: row.kickoffAt,
    status: row.status as MatchStatus,
    homeScore: row.homeScore,
    awayScore: row.awayScore,
    venueName: row.venue?.name ?? null,
  };
}

/**
 * The next scheduled (or currently live) fixture, for the homepage's
 * "Next Match" strip. Returns `null` — never a fabricated fixture — both
 * when nothing is scheduled yet and when the query itself fails (e.g. a
 * transient DB/connection issue), so a data-layer hiccup degrades the
 * homepage to an empty state instead of a 500 for every visitor.
 */
export async function getNextFixture(): Promise<MatchSummary | null> {
  try {
    const fixture = await prisma.fixture.findFirst({
      where: { status: { in: ['SCHEDULED', 'LIVE'] } },
      orderBy: { kickoffAt: 'asc' },
      select: MATCH_SELECT,
    });

    return fixture ? toMatchSummary(fixture) : null;
  } catch (error) {
    console.error('[getNextFixture] failed to load next fixture:', error);
    return null;
  }
}

/**
 * The most recently completed fixture, for the homepage's "Latest Result"
 * card. Returns `null` when the club has no recorded results yet, or when
 * the query fails — same degrade-gracefully rationale as getNextFixture.
 */
export async function getLatestResult(): Promise<MatchSummary | null> {
  try {
    const fixture = await prisma.fixture.findFirst({
      where: { status: 'FULL_TIME' },
      orderBy: { kickoffAt: 'desc' },
      select: MATCH_SELECT,
    });

    return fixture ? toMatchSummary(fixture) : null;
  } catch (error) {
    console.error('[getLatestResult] failed to load latest result:', error);
    return null;
  }
}

/**
 * The most recent N completed fixtures, for the homepage's "Latest
 * Results" section (a row of ResultCards, distinct from the single
 * `getLatestResult` used elsewhere). Returns an empty array — never
 * fabricated scorelines — when nothing has been played yet.
 */
export async function getRecentResults(limit = 3): Promise<MatchSummary[]> {
  try {
    const fixtures = await prisma.fixture.findMany({
      where: { status: 'FULL_TIME' },
      orderBy: { kickoffAt: 'desc' },
      take: limit,
      select: MATCH_SELECT,
    });

    return fixtures.map(toMatchSummary);
  } catch (error) {
    console.error('[getRecentResults] failed to load recent results:', error);
    return [];
  }
}

/**
 * Paginated, optionally competition-filtered list of upcoming/live
 * fixtures, for the full /fixtures page (as opposed to `getNextFixture`,
 * which only ever returns the single next one). Returns an empty page —
 * never fabricated fixtures — on failure, with `total: 0` so the page
 * renders its EmptyState rather than a broken pager.
 */
export async function getUpcomingFixturesList(
  params: PaginationParams & { competitionId?: string }
): Promise<PaginatedResult<MatchSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = {
      status: { in: ['SCHEDULED', 'LIVE'] },
      ...(params.competitionId ? { competitionId: params.competitionId } : {}),
    };

    const [fixtures, total] = await Promise.all([
      prisma.fixture.findMany({ where, orderBy: { kickoffAt: 'asc' }, skip, take, select: MATCH_SELECT }),
      prisma.fixture.count({ where }),
    ]);

    return toPaginatedResult(fixtures.map(toMatchSummary), total, page, pageSize);
  } catch (error) {
    console.error('[getUpcomingFixturesList] failed to load fixtures:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

/**
 * Paginated, optionally competition-filtered list of completed fixtures
 * (most recent first), for the full /results page.
 */
export async function getResultsList(
  params: PaginationParams & { competitionId?: string }
): Promise<PaginatedResult<MatchSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = {
      status: 'FULL_TIME',
      ...(params.competitionId ? { competitionId: params.competitionId } : {}),
    };

    const [fixtures, total] = await Promise.all([
      prisma.fixture.findMany({ where, orderBy: { kickoffAt: 'desc' }, skip, take, select: MATCH_SELECT }),
      prisma.fixture.count({ where }),
    ]);

    return toPaginatedResult(fixtures.map(toMatchSummary), total, page, pageSize);
  } catch (error) {
    console.error('[getResultsList] failed to load results:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

// ───────────────────────────────
// ADMIN
// ───────────────────────────────

export interface VenueOption {
  id: string;
  name: string;
}

/**
 * All venues, for the fixture form's venue Select. Venue CRUD itself
 * isn't one of the requested Admin CMS modules — venues are assumed to be
 * seeded/added directly for now. Documented here rather than silently
 * leaving the Select empty with no explanation.
 */
export async function getVenues(): Promise<VenueOption[]> {
  try {
    return await prisma.venue.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  } catch (error) {
    console.error('[getVenues] failed to load venues:', error);
    return [];
  }
}

export interface AdminFixtureRow {
  id: string;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
}

/**
 * Every fixture regardless of status/date, most recent kickoff first, for
 * /admin/fixtures. Unlike the public getUpcomingFixturesList/getResultsList,
 * this shows scheduled, live, completed, postponed, and cancelled fixtures
 * all together — staff need to manage the whole set, not just what a
 * visitor would see.
 */
export async function getAdminFixturesList(
  params: PaginationParams & { competitionId?: string }
): Promise<PaginatedResult<AdminFixtureRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = { ...(params.competitionId ? { competitionId: params.competitionId } : {}) };

    const [fixtures, total] = await Promise.all([
      prisma.fixture.findMany({
        where,
        orderBy: { kickoffAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          homeTeamName: true,
          awayTeamName: true,
          isHome: true,
          kickoffAt: true,
          status: true,
          homeScore: true,
          awayScore: true,
          competition: { select: { name: true } },
        },
      }),
      prisma.fixture.count({ where }),
    ]);

    return toPaginatedResult(
      fixtures.map((f) => ({
        id: f.id,
        competitionName: f.competition?.name ?? 'Friendly',
        homeTeamName: f.homeTeamName,
        awayTeamName: f.awayTeamName,
        isHome: f.isHome,
        kickoffAt: f.kickoffAt,
        status: f.status,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminFixturesList] failed to load fixtures:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface FixtureEditData {
  id: string;
  seasonId: string;
  competitionId: string;
  venueId: string | null;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  kickoffAt: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  ticketingEnabled: boolean;
}

/** Full raw fixture record for the admin edit form. */
export async function getFixtureById(id: string): Promise<FixtureEditData | null> {
  try {
    return await prisma.fixture.findUnique({
      where: { id },
      select: {
        id: true,
        seasonId: true,
        competitionId: true,
        venueId: true,
        homeTeamName: true,
        awayTeamName: true,
        isHome: true,
        kickoffAt: true,
        status: true,
        homeScore: true,
        awayScore: true,
        ticketingEnabled: true,
      },
    });
  } catch (error) {
    console.error('[getFixtureById] failed to load fixture:', error);
    return null;
  }
}
