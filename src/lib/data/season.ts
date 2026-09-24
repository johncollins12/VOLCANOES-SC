import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export interface CurrentSeason {
  id: string;
  label: string;
}

/**
 * ARCHITECTURAL CONSOLIDATION (Team & Player Module phase): the "find the
 * season marked isCurrent" query was duplicated in league-table.ts and
 * statistics.ts, and the Team page's overview section needed it a third
 * time — pulled out here so there's one query, one cache-friendly call
 * site per request (React's `cache()` also means concurrent callers in
 * the same request share one DB round trip instead of three).
 *
 * Returns `null` — never a fabricated season — if no season is marked
 * current yet, or the query fails.
 */
export const getCurrentSeason = cache(async (): Promise<CurrentSeason | null> => {
  try {
    const season = await prisma.season.findFirst({ where: { isCurrent: true }, select: { id: true, label: true } });
    return season;
  } catch (error) {
    console.error('[getCurrentSeason] failed to load current season:', error);
    return null;
  }
});

/** All seasons, for the admin fixture form's season Select. */
export async function getSeasonOptions(): Promise<CurrentSeason[]> {
  try {
    return await prisma.season.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, label: true } });
  } catch (error) {
    console.error('[getSeasonOptions] failed to load seasons:', error);
    return [];
  }
}

/**
 * Every season, for the admin fixture form's Season Select. Season CRUD
 * itself isn't one of the requested Admin CMS modules — like venues,
 * seasons are assumed to be seeded/added directly for now.
 */
export async function getSeasons(): Promise<CurrentSeason[]> {
  try {
    return await prisma.season.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, label: true } });
  } catch (error) {
    console.error('[getSeasons] failed to load seasons:', error);
    return [];
  }
}
