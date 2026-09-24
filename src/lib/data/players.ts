import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';
import { getCurrentSeason } from './season';

export interface PlayerSummary {
  id: string;
  slug: string;
  name: string;
  jerseyNumber: number | null;
  position: string | null;
  nationality: string | null;
  photoUrl: string | null;
}

export interface GoalkeeperStats {
  cleanSheets: number | null;
  saves: number | null;
  savePercentage: number | null;
  penaltiesSaved: number | null;
  goalsConceded: number | null;
}

export interface PlayerSeasonStats {
  seasonLabel: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  goalkeeper: GoalkeeperStats | null;
}

export interface PlayerProfile {
  id: string;
  slug: string;
  name: string;
  jerseyNumber: number | null;
  position: string | null;
  positionId: string | null;
  nationality: string | null;
  dateOfBirth: Date | null;
  heightCm: number | null;
  joinedDate: Date | null;
  bio: string | null;
  photoUrl: string | null;
  currentSeasonStats: PlayerSeasonStats | null;
}

const SUMMARY_SELECT = {
  id: true,
  slug: true,
  fullName: true,
  jerseyNumber: true,
  nationality: true,
  photoUrl: true,
  position: { select: { name: true } },
} as const;

function toSummary(p: {
  id: string;
  slug: string;
  fullName: string;
  jerseyNumber: number | null;
  nationality: string | null;
  photoUrl: string | null;
  position: { name: string } | null;
}): PlayerSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.fullName,
    jerseyNumber: p.jerseyNumber,
    position: p.position?.name ?? null,
    nationality: p.nationality,
    photoUrl: p.photoUrl,
  };
}

/**
 * A sample of active squad members for the homepage's "Featured Players"
 * section. There's no curated "featured" flag on the Player model yet —
 * this takes the lowest jersey numbers as a reasonable stand-in (typically
 * key/senior players) rather than an arbitrary DB order. If the club wants
 * genuine editorial control over who's featured, add an `isFeatured`
 * boolean to Player in a future schema change; this function's return
 * shape wouldn't need to change, only its `where`/`orderBy`.
 *
 * Returns an empty array — never fabricated players — when the squad
 * hasn't been entered yet, or if the query fails.
 */
export async function getFeaturedPlayers(limit = 4): Promise<PlayerSummary[]> {
  try {
    const players = await prisma.player.findMany({
      where: { isActive: true, jerseyNumber: { not: null } },
      orderBy: { jerseyNumber: 'asc' },
      take: limit,
      select: SUMMARY_SELECT,
    });
    return players.map(toSummary);
  } catch (error) {
    console.error('[getFeaturedPlayers] failed to load players:', error);
    return [];
  }
}

/**
 * The canonical squad order used across the Team page, related-players,
 * and previous/next profile navigation: position group (Goalkeeper ->
 * Defender -> Midfielder -> Forward, i.e. Position.displayOrder if set,
 * otherwise name), then jersey number. Kept as one function so every
 * feature that needs "the squad in order" agrees on what that means.
 */
export async function getFullSquad(): Promise<PlayerSummary[]> {
  try {
    const players = await prisma.player.findMany({
      where: { isActive: true },
      orderBy: [{ position: { name: 'asc' } }, { jerseyNumber: 'asc' }],
      select: SUMMARY_SELECT,
    });
    return players.map(toSummary);
  } catch (error) {
    console.error('[getFullSquad] failed to load squad:', error);
    return [];
  }
}

export interface SquadOverview {
  totalPlayers: number;
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  forwards: number;
  /** null when no player has a dateOfBirth recorded yet — never a guessed average. */
  averageAge: number | null;
}

/**
 * Squad composition stats for the Team page's "Squad Statistics" section.
 * Every count is derived from real Player rows — nothing here is a
 * placeholder number, unlike the homepage's Club Statistics (which
 * includes a genuinely unavailable Trophies field). If the squad is
 * empty, every count is honestly 0 rather than this function returning
 * null — an empty squad is a fact, not missing data.
 */
export async function getSquadOverview(): Promise<SquadOverview> {
  try {
    const players = await prisma.player.findMany({
      where: { isActive: true },
      select: { dateOfBirth: true, position: { select: { name: true } } },
    });

    const countByPosition = (name: string) => players.filter((p) => p.position?.name === name).length;

    const withDob = players.filter((p) => p.dateOfBirth);
    const averageAge =
      withDob.length === 0
        ? null
        : Math.round(
            withDob.reduce((sum, p) => sum + ageInYears(p.dateOfBirth as Date), 0) / withDob.length
          );

    return {
      totalPlayers: players.length,
      goalkeepers: countByPosition('Goalkeeper'),
      defenders: countByPosition('Defender'),
      midfielders: countByPosition('Midfielder'),
      forwards: countByPosition('Forward'),
      averageAge,
    };
  } catch (error) {
    console.error('[getSquadOverview] failed to compute squad overview:', error);
    return { totalPlayers: 0, goalkeepers: 0, defenders: 0, midfielders: 0, forwards: 0, averageAge: null };
  }
}

function ageInYears(dob: Date): number {
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

/**
 * Full player profile for /team/[slug], including current-season stats.
 * Goalkeeper-specific figures (clean sheets, saves, etc.) are only
 * included when the player's position is Goalkeeper AND at least one of
 * those fields has been recorded — see the schema comment on PlayerStat
 * in prisma/schema.prisma for why they're optional columns rather than a
 * separate table. Returns `null` (for the page to call notFound() on)
 * when no player matches the slug, or the query fails.
 */
export async function getPlayerBySlug(slug: string): Promise<PlayerProfile | null> {
  try {
    const player = await prisma.player.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        fullName: true,
        jerseyNumber: true,
        nationality: true,
        dateOfBirth: true,
        heightCm: true,
        joinedDate: true,
        bio: true,
        photoUrl: true,
        positionId: true,
        position: { select: { name: true } },
        stats: {
          where: { season: { isCurrent: true } },
          take: 1,
          select: {
            appearances: true,
            goals: true,
            assists: true,
            yellowCards: true,
            redCards: true,
            minutesPlayed: true,
            cleanSheets: true,
            saves: true,
            savePercentage: true,
            penaltiesSaved: true,
            goalsConceded: true,
            season: { select: { label: true } },
          },
        },
      },
    });

    if (!player) return null;

    const statRow = player.stats[0];
    const isGoalkeeper = player.position?.name === 'Goalkeeper';
    const hasGoalkeeperData =
      isGoalkeeper &&
      statRow &&
      [statRow.cleanSheets, statRow.saves, statRow.savePercentage, statRow.penaltiesSaved, statRow.goalsConceded].some(
        (v) => v != null
      );

    return {
      id: player.id,
      slug: player.slug,
      name: player.fullName,
      jerseyNumber: player.jerseyNumber,
      position: player.position?.name ?? null,
      positionId: player.positionId,
      nationality: player.nationality,
      dateOfBirth: player.dateOfBirth,
      heightCm: player.heightCm,
      joinedDate: player.joinedDate,
      bio: player.bio,
      photoUrl: player.photoUrl,
      currentSeasonStats: statRow
        ? {
            seasonLabel: statRow.season.label,
            appearances: statRow.appearances,
            goals: statRow.goals,
            assists: statRow.assists,
            yellowCards: statRow.yellowCards,
            redCards: statRow.redCards,
            minutesPlayed: statRow.minutesPlayed,
            goalkeeper: hasGoalkeeperData
              ? {
                  cleanSheets: statRow.cleanSheets,
                  saves: statRow.saves,
                  savePercentage: statRow.savePercentage,
                  penaltiesSaved: statRow.penaltiesSaved,
                  goalsConceded: statRow.goalsConceded,
                }
              : null,
          }
        : null,
    };
  } catch (error) {
    console.error('[getPlayerBySlug] failed to load player:', error);
    return null;
  }
}

/** Every active player's slug, for generateStaticParams on /team/[slug]. */
export async function getAllPlayerSlugs(): Promise<string[]> {
  try {
    const players = await prisma.player.findMany({ where: { isActive: true }, select: { slug: true } });
    return players.map((p) => p.slug);
  } catch (error) {
    console.error('[getAllPlayerSlugs] failed to load slugs:', error);
    return [];
  }
}

export interface AdjacentPlayers {
  previous: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
}

/**
 * Previous/next player in the same canonical order as getFullSquad
 * (position group, then jersey number) — so "Next Player" on the profile
 * page walks the squad the same way the Team page grid is laid out.
 */
export async function getAdjacentPlayers(currentPlayerId: string): Promise<AdjacentPlayers> {
  try {
    const squad = await prisma.player.findMany({
      where: { isActive: true },
      orderBy: [{ position: { name: 'asc' } }, { jerseyNumber: 'asc' }],
      select: { id: true, slug: true, fullName: true },
    });

    const index = squad.findIndex((p) => p.id === currentPlayerId);
    if (index === -1) return { previous: null, next: null };

    const prev = index > 0 ? squad[index - 1] : null;
    const next = index < squad.length - 1 ? squad[index + 1] : null;

    return {
      previous: prev ? { slug: prev.slug, name: prev.fullName } : null,
      next: next ? { slug: next.slug, name: next.fullName } : null,
    };
  } catch (error) {
    console.error('[getAdjacentPlayers] failed to resolve adjacent players:', error);
    return { previous: null, next: null };
  }
}

/** Other active players sharing the same position, for the profile page's "Related Players" section. */
export async function getRelatedPlayers(positionId: string, excludePlayerId: string, limit = 4): Promise<PlayerSummary[]> {
  try {
    const players = await prisma.player.findMany({
      where: { isActive: true, positionId, id: { not: excludePlayerId } },
      orderBy: { jerseyNumber: 'asc' },
      take: limit,
      select: SUMMARY_SELECT,
    });
    return players.map(toSummary);
  } catch (error) {
    console.error('[getRelatedPlayers] failed to load related players:', error);
    return [];
  }
}

// ───────────────────────────────
// ADMIN
// ───────────────────────────────

export interface PositionOption {
  id: string;
  name: string;
}

/** All positions, for the admin player form's Select. */
export async function getPositions(): Promise<PositionOption[]> {
  try {
    return await prisma.position.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  } catch (error) {
    console.error('[getPositions] failed to load positions:', error);
    return [];
  }
}

export interface AdminPlayerRow {
  id: string;
  fullName: string;
  jerseyNumber: number | null;
  positionName: string | null;
  nationality: string | null;
  isActive: boolean;
}

/** Paginated, searchable squad list for /admin/players. Includes inactive players (unlike every public-facing query), since staff need to reactivate them. */
export async function getAdminPlayersList(params: { page?: number; pageSize?: number; query?: string }): Promise<PaginatedResult<AdminPlayerRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = params.query ? { fullName: { contains: params.query, mode: 'insensitive' as const } } : {};

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        orderBy: { jerseyNumber: 'asc' },
        skip,
        take,
        select: {
          id: true,
          fullName: true,
          jerseyNumber: true,
          nationality: true,
          isActive: true,
          position: { select: { name: true } },
        },
      }),
      prisma.player.count({ where }),
    ]);

    return toPaginatedResult(
      players.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        jerseyNumber: p.jerseyNumber,
        positionName: p.position?.name ?? null,
        nationality: p.nationality,
        isActive: p.isActive,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminPlayersList] failed to load players:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface PlayerEditData {
  id: string;
  fullName: string;
  jerseyNumber: number | null;
  positionId: string | null;
  nationality: string | null;
  dateOfBirth: Date | null;
  heightCm: number | null;
  joinedDate: Date | null;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  currentSeasonStats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    cleanSheets: number | null;
    saves: number | null;
    savePercentage: number | null;
    penaltiesSaved: number | null;
    goalsConceded: number | null;
  } | null;
}

/** Full player record for /admin/players/[id]/edit, including the current season's stat row if one exists (for the optional stats fieldset). */
export async function getPlayerForEdit(id: string): Promise<PlayerEditData | null> {
  try {
    const currentSeason = await getCurrentSeason();

    const player = await prisma.player.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        jerseyNumber: true,
        positionId: true,
        nationality: true,
        dateOfBirth: true,
        heightCm: true,
        joinedDate: true,
        bio: true,
        photoUrl: true,
        isActive: true,
        stats: currentSeason ? { where: { seasonId: currentSeason.id } } : false,
      },
    });

    if (!player) return null;

    const stat = Array.isArray(player.stats) ? player.stats[0] : undefined;

    return {
      id: player.id,
      fullName: player.fullName,
      jerseyNumber: player.jerseyNumber,
      positionId: player.positionId,
      nationality: player.nationality,
      dateOfBirth: player.dateOfBirth,
      heightCm: player.heightCm,
      joinedDate: player.joinedDate,
      bio: player.bio,
      photoUrl: player.photoUrl,
      isActive: player.isActive,
      currentSeasonStats: stat
        ? {
            appearances: stat.appearances,
            goals: stat.goals,
            assists: stat.assists,
            yellowCards: stat.yellowCards,
            redCards: stat.redCards,
            minutesPlayed: stat.minutesPlayed,
            cleanSheets: stat.cleanSheets,
            saves: stat.saves,
            savePercentage: stat.savePercentage,
            penaltiesSaved: stat.penaltiesSaved,
            goalsConceded: stat.goalsConceded,
          }
        : null,
    };
  } catch (error) {
    console.error('[getPlayerForEdit] failed to load player:', error);
    return null;
  }
}
