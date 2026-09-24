import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/config/site';
import { Section, Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { NewsCard } from '@/components/football/NewsCard';
import { ShareButtons } from '@/components/media/ShareButtons';
import { formatDisplayDate, truncateText } from '@/lib/utils';
import { getArticleBySlug, getAllArticleSlugs, getAdjacentArticles, getRelatedArticles } from '@/lib/data';

export const revalidate = 300;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every published article at build time — SEO-friendly static routes. */
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Strips HTML tags for use as a meta description — `body` is stored as rich HTML, not plain text (see the page component's comment on why). */
function toPlainTextSummary(html: string, maxLength = 155): string {
  const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return truncateText(plainText, maxLength);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: 'Article Not Found',
      description: 'This article could not be found.',
      path: `/news/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: article.title,
    description: toPlainTextSummary(article.body),
    path: `/news/${article.slug}`,
    ogImage: article.coverImageUrl ?? undefined,
  });
}

/**
 * /news/[slug] — full article. SEO-friendly static route, Open Graph
 * metadata via generateMetadata above, and NewsArticle structured data
 * below. `body` is rendered as HTML (dangerouslySetInnerHTML) because it
 * comes from RichTextEditor (components/cms/RichTextEditor.tsx), which
 * stores formatted HTML, not plain text/Markdown — see that component's
 * comments for the CMS-side rationale.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const [adjacent, related] = await Promise.all([
    getAdjacentArticles(article.id, article.publishedAt),
    getRelatedArticles(article.categoryId, article.id),
  ]);

  const articleUrl = `${SITE_CONFIG.url}/news/${article.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    ...(article.coverImageUrl ? { image: [article.coverImageUrl] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString() } : {}),
    ...(article.authorName ? { author: { '@type': 'Person', name: article.authorName } } : {}),
    publisher: { '@type': 'Organization', name: SITE_CONFIG.name },
    mainEntityOfPage: articleUrl,
  };

  return (
    <Section>
      <Container className="max-w-3xl">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {article.categoryName && <Badge>{article.categoryName}</Badge>}
          {article.publishedAt && <span className="text-sm text-muted">{formatDisplayDate(article.publishedAt)}</span>}
          <span className="flex items-center gap-1 text-sm text-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {article.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{article.title}</h1>

        {article.authorName && <p className="mt-2 text-sm text-muted">By {article.authorName}</p>}

        {article.coverImageUrl && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-card bg-charcoal">
            <Image
              src={article.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </div>
        )}

        <div
          className="prose-content mt-8 text-sm leading-relaxed text-ink/90 [&_a]:text-cyan [&_a]:underline [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <div className="mt-8 border-t border-border pt-6">
          <ShareButtons url={articleUrl} title={article.title} />
        </div>

        {(adjacent.previous || adjacent.next) && (
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm">
            {adjacent.previous ? (
              <Link
                href={`/news/${adjacent.previous.slug}`}
                className="flex items-center gap-1.5 font-medium text-ink hover:text-cyan"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                <span className="line-clamp-1">{adjacent.previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next && (
              <Link
                href={`/news/${adjacent.next.slug}`}
                className="flex items-center gap-1.5 text-right font-medium text-ink hover:text-cyan"
              >
                <span className="line-clamp-1">{adjacent.next.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((a) => (
                <NewsCard
                  key={a.id}
                  title={a.title}
                  excerpt={a.excerpt}
                  categoryName={a.categoryName}
                  coverImageUrl={a.coverImageUrl}
                  publishedAt={a.publishedAt}
                  href={`/news/${a.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
