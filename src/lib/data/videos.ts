import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface VideoCategoryOption {
  id: string;
  name: string;
}

export interface VideoSummary {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  externalUrl: string | null;
  storagePath: string | null;
  thumbnailUrl: string | null;
  categoryName: string | null;
  publishedAt: Date | null;
}

export async function getVideoCategories(): Promise<VideoCategoryOption[]> {
  try {
    const categories = await prisma.videoCategory.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
    return categories;
  } catch (error) {
    console.error('[getVideoCategories] failed to load video categories:', error);
    return [];
  }
}

/**
 * Paginated, optionally category-filtered videos for the Video Centre,
 * most recently published first. `provider` determines how VideoEmbed
 * (components/media/VideoEmbed.tsx) renders a given entry — currently
 * YOUTUBE is the only one with real embed support built (see that
 * component for the documented limitation on VIMEO/SUPABASE_STORAGE).
 *
 * REAL BUG FIX (Admin CMS phase): this never filtered on `publishedAt`,
 * so a draft video (publishedAt still null, created but not yet
 * published from the admin) would already be visible on the public Video
 * Centre — there was no publish workflow in effect despite the field
 * existing. Now requires `publishedAt` to be set; getAdminVideosList
 * (below) is the one that intentionally shows everything, drafts
 * included, for staff to manage.
 */
export async function getVideosList(params: { page?: number; pageSize?: number; categoryId?: string }): Promise<PaginatedResult<VideoSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = { publishedAt: { not: null }, ...(params.categoryId ? { categoryId: params.categoryId } : {}) };

    const [videos, total] = await Promise.all([
      prisma.videoEntry.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          description: true,
          provider: true,
          externalUrl: true,
          storagePath: true,
          thumbnailUrl: true,
          publishedAt: true,
          category: { select: { name: true } },
        },
      }),
      prisma.videoEntry.count({ where }),
    ]);

    return toPaginatedResult(
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        provider: v.provider,
        externalUrl: v.externalUrl,
        storagePath: v.storagePath,
        thumbnailUrl: v.thumbnailUrl,
        categoryName: v.category?.name ?? null,
        publishedAt: v.publishedAt,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getVideosList] failed to load videos:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface AdminVideoRow {
  id: string;
  title: string;
  categoryName: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
}

/** Every video regardless of publish status — the admin counterpart to getVideosList's public (published-only) query. */
export async function getAdminVideosList(params: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
}): Promise<PaginatedResult<AdminVideoRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = params.categoryId ? { categoryId: params.categoryId } : {};

    const [videos, total] = await Promise.all([
      prisma.videoEntry.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }],
        skip,
        take,
        select: { id: true, title: true, isFeatured: true, publishedAt: true, category: { select: { name: true } } },
      }),
      prisma.videoEntry.count({ where }),
    ]);

    return toPaginatedResult(
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        categoryName: v.category?.name ?? null,
        isFeatured: v.isFeatured,
        publishedAt: v.publishedAt,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminVideosList] failed to load videos:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface VideoEditData {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  externalUrl: string | null;
  thumbnailUrl: string | null;
  categoryId: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
}

export async function getVideoById(id: string): Promise<VideoEditData | null> {
  try {
    return await prisma.videoEntry.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        provider: true,
        externalUrl: true,
        thumbnailUrl: true,
        categoryId: true,
        isFeatured: true,
        publishedAt: true,
      },
    });
  } catch (error) {
    console.error('[getVideoById] failed to load video:', error);
    return null;
  }
}
