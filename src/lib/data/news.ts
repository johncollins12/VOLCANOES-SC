import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface NewsArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  categoryName: string | null;
}

export interface NewsCategoryOption {
  id: string;
  name: string;
}

export interface NewsArticleDetail {
  id: string;
  title: string;
  slug: string;
  body: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  categoryId: string | null;
  categoryName: string | null;
  authorName: string | null;
  /** Words-per-minute estimate from `body`'s plain-text length — see readingTimeMinutes(). */
  readingTimeMinutes: number;
}

const SUMMARY_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  category: { select: { name: true } },
} as const;

function toSummary(a: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  category: { name: string } | null;
}): NewsArticleSummary {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt,
    categoryName: a.category?.name ?? null,
  };
}

/** Average adult silent reading speed, used only to give readers a rough estimate — not shown as a precise figure. */
const WORDS_PER_MINUTE = 200;

function readingTimeMinutes(body: string): number {
  const plainText = body.replace(/<[^>]+>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/**
 * Every article regardless of status (unlike getPaginatedNews, which is
 * PUBLISHED-only for the public site), for the admin News list — staff
 * need to see and manage drafts too. See the ADMIN section further down
 * for the actual implementation (getAdminNewsList) — this comment marks
 * where an earlier, superseded version of that function used to live.
 *
 * BUG FIX (Admin CMS phase): this file briefly had TWO functions named
 * `getAdminNewsList` — the version below (a simpler one without category
 * filtering, returning an `AdminNewsArticle` shape) and the one in the
 * "ADMIN" section further down (with categoryId filtering, returning
 * `AdminNewsArticleRow`, actually wired into the /admin/news page).
 * Duplicate named exports in one ES module are a hard compile error, not
 * just dead code — this would have failed `tsc`/the build outright. The
 * unused first version (and its now-orphaned `AdminNewsArticle` type,
 * `ADMIN_SELECT` constant, and `toAdminArticle` helper) were removed;
 * confirmed via a repo-wide search that nothing imported them.
 */
export async function getLatestNews(limit = 3): Promise<NewsArticleSummary[]> {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: SUMMARY_SELECT,
    });
    return articles.map(toSummary);
  } catch (error) {
    console.error('[getLatestNews] failed to load news:', error);
    return [];
  }
}

/**
 * The single most recent published article, for the /news index page's
 * "Featured Article" slot (shown larger, above the regular grid). Returns
 * `null` when nothing's published yet.
 */
export async function getFeaturedArticle(): Promise<NewsArticleSummary | null> {
  const [latest] = await getLatestNews(1);
  return latest ?? null;
}

/** All news categories, for the /news category filter. */
export async function getNewsCategories(): Promise<NewsCategoryOption[]> {
  try {
    const categories = await prisma.newsCategory.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
    return categories;
  } catch (error) {
    console.error('[getNewsCategories] failed to load categories:', error);
    return [];
  }
}

export interface PaginatedNewsParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  query?: string;
}

/**
 * Paginated, optionally category-filtered and searched news list for the
 * /news index page (distinct from `getLatestNews`, which only ever
 * returns an unfiltered "most recent N" — the homepage teaser).
 *
 * Search is a simple case-insensitive `contains` on title — not a full-text
 * search engine. Fine for the article volumes a single club produces;
 * revisit (Postgres full-text search or an external index) only if that
 * stops being true.
 */
export async function getPaginatedNews(params: PaginatedNewsParams): Promise<PaginatedResult<NewsArticleSummary>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = {
      status: 'PUBLISHED',
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.query ? { title: { contains: params.query, mode: 'insensitive' as const } } : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take, select: SUMMARY_SELECT }),
      prisma.newsArticle.count({ where }),
    ]);

    return toPaginatedResult(articles.map(toSummary), total, page, pageSize);
  } catch (error) {
    console.error('[getPaginatedNews] failed to load news:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

/**
 * Full article detail for /news/[slug], including author name and an
 * estimated reading time. Returns `null` (for the page to call notFound()
 * on) when no published article matches the slug, or the query fails.
 */
export async function getArticleBySlug(slug: string): Promise<NewsArticleDetail | null> {
  try {
    const article = await prisma.newsArticle.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        coverImageUrl: true,
        publishedAt: true,
        categoryId: true,
        category: { select: { name: true } },
        author: { select: { fullName: true } },
      },
    });

    if (!article) return null;

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      body: article.body,
      coverImageUrl: article.coverImageUrl,
      publishedAt: article.publishedAt,
      categoryId: article.categoryId,
      categoryName: article.category?.name ?? null,
      authorName: article.author?.fullName ?? null,
      readingTimeMinutes: readingTimeMinutes(article.body),
    };
  } catch (error) {
    console.error('[getArticleBySlug] failed to load article:', error);
    return null;
  }
}

/** Every published article's slug, for generateStaticParams on /news/[slug]. */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const articles = await prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true } });
    return articles.map((a) => a.slug);
  } catch (error) {
    console.error('[getAllArticleSlugs] failed to load slugs:', error);
    return [];
  }
}

export interface AdjacentArticles {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

/**
 * Previous/next published article by publication date — "previous" is the
 * next-older article, "next" is the next-newer one, matching how a reader
 * thinks of paging through a chronological feed.
 */
export async function getAdjacentArticles(currentId: string, publishedAt: Date | null): Promise<AdjacentArticles> {
  if (!publishedAt) return { previous: null, next: null };

  try {
    const [older, newer] = await Promise.all([
      prisma.newsArticle.findFirst({
        where: { status: 'PUBLISHED', publishedAt: { lt: publishedAt }, id: { not: currentId } },
        orderBy: { publishedAt: 'desc' },
        select: { slug: true, title: true },
      }),
      prisma.newsArticle.findFirst({
        where: { status: 'PUBLISHED', publishedAt: { gt: publishedAt }, id: { not: currentId } },
        orderBy: { publishedAt: 'asc' },
        select: { slug: true, title: true },
      }),
    ]);

    return { previous: older, next: newer };
  } catch (error) {
    console.error('[getAdjacentArticles] failed to resolve adjacent articles:', error);
    return { previous: null, next: null };
  }
}

/** Other published articles in the same category, for the article page's "Related Articles" section. */
export async function getRelatedArticles(categoryId: string | null, excludeId: string, limit = 3): Promise<NewsArticleSummary[]> {
  if (!categoryId) return [];

  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED', categoryId, id: { not: excludeId } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: SUMMARY_SELECT,
    });
    return articles.map(toSummary);
  } catch (error) {
    console.error('[getRelatedArticles] failed to load related articles:', error);
    return [];
  }
}

// ───────────────────────────────
// ADMIN
// ───────────────────────────────

export interface AdminNewsArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  categoryName: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

export interface AdminNewsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  categoryId?: string;
  query?: string;
}

/** All articles regardless of status, for /admin/news — unlike the public data functions above, which only ever return PUBLISHED rows. */
export async function getAdminNewsList(params: AdminNewsListParams): Promise<PaginatedResult<AdminNewsArticleRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = {
      ...(params.status ? { status: params.status } : {}),
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.query ? { title: { contains: params.query, mode: 'insensitive' as const } } : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
          category: { select: { name: true } },
          author: { select: { fullName: true } },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return toPaginatedResult(
      articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
        categoryName: a.category?.name ?? null,
        authorName: a.author?.fullName ?? null,
        publishedAt: a.publishedAt,
        updatedAt: a.updatedAt,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminNewsList] failed to load articles:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface NewsArticleEditData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverImageUrl: string | null;
  categoryId: string | null;
  status: string;
}

/** Full raw article record for the edit form (unlike getArticleBySlug, includes drafts and every raw field the form needs). */
export async function getNewsArticleById(id: string): Promise<NewsArticleEditData | null> {
  try {
    return await prisma.newsArticle.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        coverImageUrl: true,
        categoryId: true,
        status: true,
      },
    });
  } catch (error) {
    console.error('[getNewsArticleById] failed to load article:', error);
    return null;
  }
}
