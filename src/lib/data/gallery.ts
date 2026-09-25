import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface GalleryImageForSlider {
  id: string;
  imageUrl: string;
  caption: string | null;
  albumId: string;
  albumTitle: string;
}

export async function getRecentGalleryImages(limit = 8): Promise<GalleryImageForSlider[]> {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 10,
      select: {
        id: true,
        title: true,
        images: { select: { id: true, imageUrl: true, caption: true } },
      },
    });

    const images: GalleryImageForSlider[] = [];
    for (const album of albums) {
      for (const image of album.images) {
        images.push({ id: image.id, imageUrl: image.imageUrl, caption: image.caption, albumId: album.id, albumTitle: album.title });
        if (images.length >= limit) return images;
      }
    }
    return images;
  } catch (error) {
    console.error('[getRecentGalleryImages] failed to load images:', error);
    return [];
  }
}

export interface GalleryAlbumSummary {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  imageCount: number;
  displayOrder: number;
}

/**
 * Paginated photo albums for /gallery (and reused as-is for
 * /admin/gallery — there's no admin-only concern like a draft/published
 * status on GalleryAlbum, so one query serves both).
 *
 * REAL BUG FIX (Admin CMS phase): ordered by createdAt only, ignoring the
 * (now-added, see GalleryAlbum.displayOrder's schema comment) explicit
 * ordering field — so "Album ordering," one of this phase's explicit
 * requirements, wouldn't actually have had any visible effect without
 * this fix.
 *
 * Routes as /gallery/[id] — GalleryAlbum has no slug field (unlike
 * NewsArticle/Player); adding one wasn't necessary since a raw id is a
 * reasonable URL for an album index the club browses internally more than
 * it gets shared/indexed article-style. Revisit if that assumption stops
 * holding (e.g. the club wants to link specific albums from social media
 * with a readable URL).
 */
export async function getGalleryAlbums(params: { page?: number; pageSize?: number }): Promise<PaginatedResult<GalleryAlbumSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const [albums, total] = await Promise.all([
      prisma.galleryAlbum.findMany({
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          displayOrder: true,
          _count: { select: { images: true } },
        },
      }),
      prisma.galleryAlbum.count(),
    ]);

    return toPaginatedResult(
      albums.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        coverImageUrl: a.coverImageUrl,
        imageCount: a._count.images,
        displayOrder: a.displayOrder,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getGalleryAlbums] failed to load albums:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface GalleryAlbumDetail {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  displayOrder: number;
  images: { id: string; imageUrl: string; caption: string | null }[];
}

/**
 * Full album with every image, for /gallery/[id] AND /admin/gallery/[id]/edit
 * (the admin edit form needs coverImageUrl/displayOrder too — reused as one
 * query rather than a near-duplicate admin-only version). Returns `null`
 * when the album doesn't exist or the query fails.
 */
export async function getAlbumById(id: string): Promise<GalleryAlbumDetail | null> {
  try {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        coverImageUrl: true,
        displayOrder: true,
        images: { select: { id: true, imageUrl: true, caption: true } },
      },
    });
    return album;
  } catch (error) {
    console.error('[getAlbumById] failed to load album:', error);
    return null;
  }
}

/** Every album id, for generateStaticParams on /gallery/[id]. */
export async function getAllAlbumIds(): Promise<string[]> {
  try {
    const albums = await prisma.galleryAlbum.findMany({ select: { id: true } });
    return albums.map((a) => a.id);
  } catch (error) {
    console.error('[getAllAlbumIds] failed to load album ids:', error);
    return [];
  }
}
