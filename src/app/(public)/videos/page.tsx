import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { VideoLightbox } from '@/components/media/VideoLightbox';
import { VideoCategoryFilter } from '@/components/media/VideoCategoryFilter';
import { getVideosList, getVideoCategories } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Videos',
  description: 'Match highlights, interviews, and behind-the-scenes videos from Volcanoes FC.',
  path: '/videos',
});

interface VideosPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

/**
 * /videos — category filter + a grid that plays videos in a modal
 * (VideoLightbox) rather than navigating to a per-video page, same
 * "browse in place" rationale as the photo gallery.
 */
export default async function VideosPage({ searchParams }: VideosPageProps) {
  const { page: pageParam, category } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [videos, categories] = await Promise.all([
    getVideosList({ page, pageSize: 9, categoryId: category }),
    getVideoCategories(),
  ]);

  return (
    <Section>
      <Container>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold text-ink">Videos</h1>
          <VideoCategoryFilter categories={categories} />
        </div>
        <p className="mb-6 text-sm text-muted">Highlights, interviews and club video content.</p>

        {videos.items.length === 0 ? (
          <EmptyState
            title="No videos yet"
            description={
              category
                ? 'No videos found in this category. Try a different filter.'
                : 'Videos will appear here once published from the admin dashboard.'
            }
          />
        ) : (
          <>
            <VideoLightbox videos={videos.items} />

            {videos.totalPages > 1 && (
              <URLPagination page={videos.page} totalPages={videos.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
