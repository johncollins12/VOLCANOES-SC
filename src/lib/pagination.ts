import type { PaginatedResult, PaginationParams } from '@/types';

/**
 * Generic pagination helper used by every future feature's "list" service
 * (news list, players list, orders list, etc.) so pagination math and the
 * response shape (`PaginatedResult<T>`) stay identical across the app.
 *
 * Usage inside a feature's data-access function:
 *
 *   const { skip, take, page, pageSize } = resolvePagination(params);
 *   const [items, total] = await Promise.all([
 *     prisma.newsArticle.findMany({ skip, take, orderBy: { publishedAt: 'desc' } }),
 *     prisma.newsArticle.count(),
 *   ]);
 *   return toPaginatedResult(items, total, page, pageSize);
 */
export function resolvePagination(params: PaginationParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function toPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
