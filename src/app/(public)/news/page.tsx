import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { NewsCard } from '@/components/football/NewsCard';
import { NewsFilters } from '@/components/media/NewsFilters';
import { getPaginatedNews, getNewsCategories, getFeaturedArticle } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'News',
  description: 'The latest news, updates, and announcements from Volcanoes FC.',
  path: '/news',
});

interface NewsPageProps {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

/**
 * /news — featured article (only shown on the unfiltered first page, so
 * it doesn't look like a stray search result when filtering/searching),
 * category + search filters (both URL-driven, see NewsFilters), and a
 * paginated grid for everything else.
 */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page: pageParam, category, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const isUnfiltered = !category && !q && page === 1;

  const [articles, categories, featured] = await Promise.all([
    getPaginatedNews({ page, pageSize: 9, categoryId: category, query: q }),
    getNewsCategories(),
    isUnfiltered ? getFeaturedArticle() : Promise.resolve(null),
  ]);

  // When the featured article is shown up top, don't repeat it in the grid below.
  const gridArticles = featured ? articles.items.filter((a) => a.id !== featured.id) : articles.items;

  return (
    <Section>
      <Container>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold text-ink">News</h1>
          <NewsFilters categories={categories} />
        </div>
        <p className="mb-6 text-sm text-muted">The latest news from around the club.</p>

        {featured && (
          <div className="mb-8">
            <NewsCard
              title={featured.title}
              excerpt={featured.excerpt}
              categoryName={featured.categoryName}
              coverImageUrl={featured.coverImageUrl}
              publishedAt={featured.publishedAt}
              href={`/news/${featured.slug}`}
              featured
            />
          </div>
        )}

        {gridArticles.length === 0 && !featured ? (
          <EmptyState
            title="No news yet"
            description={
              category || q
                ? 'No articles match your filters. Try a different category or search term.'
                : 'Articles will appear here once published from the admin dashboard.'
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  categoryName={article.categoryName}
                  coverImageUrl={article.coverImageUrl}
                  publishedAt={article.publishedAt}
                  href={`/news/${article.slug}`}
                />
              ))}
            </div>

            {articles.totalPages > 1 && (
              <URLPagination page={articles.page} totalPages={articles.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
