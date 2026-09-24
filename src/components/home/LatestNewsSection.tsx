import Link from 'next/link';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { NewsCard } from '@/components/football/NewsCard';
import { buttonVariants } from '@/components/ui/Button';
import type { NewsArticleSummary } from '@/lib/data/news';

/**
 * Homepage "Latest News" section. Receives pre-fetched articles as props
 * (see src/lib/data/news.ts) — this component only lays them out, so the
 * same layout can later be reused for a "related articles" block without
 * duplicating the data-fetching logic.
 */
export function LatestNewsSection({ articles }: { articles: NewsArticleSummary[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Latest News</h2>
          <Link href="/news" className="text-sm font-medium text-cyan hover:underline">
            View all news →
          </Link>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            title="No news published yet"
            description="Club news and match reports will appear here once the first article is published from the admin dashboard."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt}
                categoryName={article.categoryName}
                coverImageUrl={article.coverImageUrl}
                publishedAt={article.publishedAt}
                href={`/news/${article.slug}`}
                featured={index === 0}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <Link href="/news" className={buttonVariants({ variant: 'outline' })}>
            View all news
          </Link>
        </div>
      </Container>
    </Section>
  );
}
