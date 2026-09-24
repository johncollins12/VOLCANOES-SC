import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface MatchReportSummary {
  /** Routes as /match-reports/[fixtureId] — see ResultCard's `href` convention established in the Football Module phase. */
  fixtureId: string;
  title: string;
  coverImageUrl: string | null;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
  kickoffAt: Date;
  publishedAt: Date | null;
}

const SUMMARY_SELECT = {
  fixtureId: true,
  title: true,
  coverImageUrl: true,
  publishedAt: true,
  fixture: {
    select: {
      homeTeamName: true,
      awayTeamName: true,
      isHome: true,
      homeScore: true,
      awayScore: true,
      kickoffAt: true,
      competition: { select: { name: true } },
    },
  },
} as const;

function toSummary(r: {
  fixtureId: string;
  title: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  fixture: {
    homeTeamName: string;
    awayTeamName: string;
    isHome: boolean;
    homeScore: number | null;
    awayScore: number | null;
    kickoffAt: Date;
    competition: { name: string } | null;
  };
}): MatchReportSummary {
  return {
    fixtureId: r.fixtureId,
    title: r.title,
    coverImageUrl: r.coverImageUrl,
    competitionName: r.fixture.competition?.name ?? 'Friendly',
    homeTeamName: r.fixture.homeTeamName,
    isHome: r.fixture.isHome,
    awayTeamName: r.fixture.awayTeamName,
    homeScore: r.fixture.homeScore,
    awayScore: r.fixture.awayScore,
    kickoffAt: r.fixture.kickoffAt,
    publishedAt: r.publishedAt,
  };
}

/**
 * Paginated, published match reports, most recent match first. Only
 * reports with a `publishedAt` are listed — a report can exist in a DRAFT-
 * like state (no publishedAt set) while a writer is still working on it,
 * mirroring how NewsArticle uses `status`. Returns an empty page — never
 * fabricated reports — on failure or when none exist yet.
 */
export async function getMatchReportsList(params: { page?: number; pageSize?: number }): Promise<PaginatedResult<MatchReportSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = { publishedAt: { not: null } };

    const [reports, total] = await Promise.all([
      prisma.matchReport.findMany({
        where,
        orderBy: { fixture: { kickoffAt: 'desc' } },
        skip,
        take,
        select: SUMMARY_SELECT,
      }),
      prisma.matchReport.count({ where }),
    ]);

    return toPaginatedResult(reports.map(toSummary), total, page, pageSize);
  } catch (error) {
    console.error('[getMatchReportsList] failed to load match reports:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface MatchStatisticsRow {
  possessionHome: number | null;
  possessionAway: number | null;
  shotsHome: number | null;
  shotsAway: number | null;
  shotsOnTargetHome: number | null;
  shotsOnTargetAway: number | null;
  cornersHome: number | null;
  cornersAway: number | null;
  foulsHome: number | null;
  foulsAway: number | null;
}

export interface MatchReportDetail {
  fixtureId: string;
  title: string;
  body: string;
  coverImageUrl: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
  kickoffAt: Date;
  venueName: string | null;
  statistics: MatchStatisticsRow | null;
}

/**
 * Full match report for /match-reports/[fixtureId], including venue,
 * scoreline, and match statistics "where available" — `statistics` is
 * `null` when no MatchStatistics row exists at all for the fixture (the
 * page shows an honest "not recorded" message rather than a table of
 * dashes); individual stat *pairs* within a present row can still be null
 * and are hidden per-row by MatchStatistics.tsx (see that component and
 * the schema comment on the MatchStatistics model for why).
 */
export async function getMatchReportByFixtureId(fixtureId: string): Promise<MatchReportDetail | null> {
  try {
    const report = await prisma.matchReport.findFirst({
      where: { fixtureId, publishedAt: { not: null } },
      select: {
        fixtureId: true,
        title: true,
        body: true,
        coverImageUrl: true,
        publishedAt: true,
        author: { select: { fullName: true } },
        fixture: {
          select: {
            homeTeamName: true,
            awayTeamName: true,
            isHome: true,
            homeScore: true,
            awayScore: true,
            kickoffAt: true,
            competition: { select: { name: true } },
            venue: { select: { name: true } },
            matchStatistics: true,
          },
        },
      },
    });

    if (!report) return null;

    const stats = report.fixture.matchStatistics;

    return {
      fixtureId: report.fixtureId,
      title: report.title,
      body: report.body,
      coverImageUrl: report.coverImageUrl,
      authorName: report.author?.fullName ?? null,
      publishedAt: report.publishedAt,
      competitionName: report.fixture.competition?.name ?? 'Friendly',
      homeTeamName: report.fixture.homeTeamName,
      awayTeamName: report.fixture.awayTeamName,
      isHome: report.fixture.isHome,
      homeScore: report.fixture.homeScore,
      awayScore: report.fixture.awayScore,
      kickoffAt: report.fixture.kickoffAt,
      venueName: report.fixture.venue?.name ?? null,
      statistics: stats
        ? {
            possessionHome: stats.possessionHome,
            possessionAway: stats.possessionAway,
            shotsHome: stats.shotsHome,
            shotsAway: stats.shotsAway,
            shotsOnTargetHome: stats.shotsOnTargetHome,
            shotsOnTargetAway: stats.shotsOnTargetAway,
            cornersHome: stats.cornersHome,
            cornersAway: stats.cornersAway,
            foulsHome: stats.foulsHome,
            foulsAway: stats.foulsAway,
          }
        : null,
    };
  } catch (error) {
    console.error('[getMatchReportByFixtureId] failed to load match report:', error);
    return null;
  }
}

/** Every published match report's fixture id, for generateStaticParams on /match-reports/[fixtureId]. */
export async function getAllMatchReportFixtureIds(): Promise<string[]> {
  try {
    const reports = await prisma.matchReport.findMany({
      where: { publishedAt: { not: null } },
      select: { fixtureId: true },
    });
    return reports.map((r) => r.fixtureId);
  } catch (error) {
    console.error('[getAllMatchReportFixtureIds] failed to load fixture ids:', error);
    return [];
  }
}

export interface MatchReportEditData {
  fixtureId: string;
  fixtureLabel: string;
  title: string;
  body: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  statistics: MatchStatisticsRow | null;
}

/**
 * For the admin match report editor (/admin/match-reports/[fixtureId]/edit).
 * Unlike the public getMatchReportByFixtureId, this doesn't require
 * `publishedAt` to be set — staff need to open a report that's still a
 * draft — and it always returns a usable shape even if no MatchReport row
 * exists yet for the fixture (title/body empty, statistics null), so the
 * same form handles "create the first report for this fixture" and
 * "edit the existing one" without a separate creation screen.
 */
export async function getMatchReportForEdit(fixtureId: string): Promise<MatchReportEditData | null> {
  try {
    const fixture = await prisma.fixture.findUnique({
      where: { id: fixtureId },
      select: {
        homeTeamName: true,
        awayTeamName: true,
        kickoffAt: true,
        matchReport: { select: { title: true, body: true, coverImageUrl: true, publishedAt: true } },
        matchStatistics: true,
      },
    });

    if (!fixture) return null;

    const stats = fixture.matchStatistics;

    return {
      fixtureId,
      fixtureLabel: `${fixture.homeTeamName} vs ${fixture.awayTeamName} — ${fixture.kickoffAt.toLocaleDateString('en-GB')}`,
      title: fixture.matchReport?.title ?? '',
      body: fixture.matchReport?.body ?? '',
      coverImageUrl: fixture.matchReport?.coverImageUrl ?? null,
      publishedAt: fixture.matchReport?.publishedAt ?? null,
      statistics: stats
        ? {
            possessionHome: stats.possessionHome,
            possessionAway: stats.possessionAway,
            shotsHome: stats.shotsHome,
            shotsAway: stats.shotsAway,
            shotsOnTargetHome: stats.shotsOnTargetHome,
            shotsOnTargetAway: stats.shotsOnTargetAway,
            cornersHome: stats.cornersHome,
            cornersAway: stats.cornersAway,
            foulsHome: stats.foulsHome,
            foulsAway: stats.foulsAway,
          }
        : null,
    };
  } catch (error) {
    console.error('[getMatchReportForEdit] failed to load report for edit:', error);
    return null;
  }
}
