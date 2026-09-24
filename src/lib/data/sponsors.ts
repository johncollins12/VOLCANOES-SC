import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface SponsorSummary {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  tierName: string | null;
}

/**
 * Active sponsors ordered by tier rank (Principal Sponsor first, etc.)
 * then by displayOrder within a tier, for the homepage sponsors strip and
 * the future /sponsors page. Returns an empty array — never fabricated
 * sponsor names/logos — when the club hasn't provided sponsor data yet,
 * or when the query itself fails (e.g. a transient DB/connection issue).
 *
 * REAL BUG FIX (Admin CMS phase): this previously ordered by tier rank
 * only, ignoring the (now-added, see Sponsor.displayOrder's schema
 * comment) per-sponsor ordering within a tier — so "Display ordering,"
 * one of this phase's explicit requirements, wouldn't actually have had
 * any visible effect without this fix.
 */
export async function getActiveSponsors(): Promise<SponsorSummary[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [{ tier: { rank: 'asc' } }, { displayOrder: 'asc' }],
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        tier: { select: { name: true } },
      },
    });

    return sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      logoUrl: s.logoUrl,
      websiteUrl: s.websiteUrl,
      tierName: s.tier?.name ?? null,
    }));
  } catch (error) {
    console.error('[getActiveSponsors] failed to load sponsors:', error);
    return [];
  }
}

export interface SponsorTierOption {
  id: string;
  name: string;
}

export async function getSponsorTiers(): Promise<SponsorTierOption[]> {
  try {
    return await prisma.sponsorTier.findMany({ orderBy: { rank: 'asc' }, select: { id: true, name: true } });
  } catch (error) {
    console.error('[getSponsorTiers] failed to load sponsor tiers:', error);
    return [];
  }
}

export interface AdminSponsorRow {
  id: string;
  name: string;
  logoUrl: string | null;
  tierName: string | null;
  displayOrder: number;
  isActive: boolean;
}

export async function getAdminSponsorsList(params: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<AdminSponsorRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const [sponsors, total] = await Promise.all([
      prisma.sponsor.findMany({
        orderBy: [{ tier: { rank: 'asc' } }, { displayOrder: 'asc' }],
        skip,
        take,
        select: {
          id: true,
          name: true,
          logoUrl: true,
          displayOrder: true,
          isActive: true,
          tier: { select: { name: true } },
        },
      }),
      prisma.sponsor.count(),
    ]);

    return toPaginatedResult(
      sponsors.map((s) => ({
        id: s.id,
        name: s.name,
        logoUrl: s.logoUrl,
        tierName: s.tier?.name ?? null,
        displayOrder: s.displayOrder,
        isActive: s.isActive,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminSponsorsList] failed to load sponsors:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface SponsorEditData {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  tierId: string | null;
  displayOrder: number;
  isActive: boolean;
}

export async function getSponsorById(id: string): Promise<SponsorEditData | null> {
  try {
    return await prisma.sponsor.findUnique({
      where: { id },
      select: { id: true, name: true, logoUrl: true, websiteUrl: true, tierId: true, displayOrder: true, isActive: true },
    });
  } catch (error) {
    console.error('[getSponsorById] failed to load sponsor:', error);
    return null;
  }
}
