import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { URLPagination } from '@/components/cms/URLPagination';
import { AlbumCard } from '@/components/media/AlbumCard';
import { getGalleryAlbums } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Gallery',
  description: 'Photo albums from SC Volcanoes matches and events.',
  path: '/gallery',
});

interface GalleryPageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * /gallery — album grid. Each album's own page (see [id]/page.tsx) is
 * where the photo lightbox lives; this index only ever shows album
 * covers, so it stays light even once the club has hundreds of photos
 * across many albums.
 */
export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const albums = await getGalleryAlbums({ page, pageSize: 12 });

  return (
    <Section>
      <Container>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Gallery</h1>
        <p className="mb-6 text-sm text-muted">Photos from matches, training and club activities.</p>

        {albums.items.length === 0 ? (
          <EmptyState
            title="No albums yet"
            description="Photo albums will appear here once uploaded from the admin dashboard."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {albums.items.map((album) => (
                <AlbumCard
                  key={album.id}
                  title={album.title}
                  description={album.description}
                  coverImageUrl={album.coverImageUrl}
                  imageCount={album.imageCount}
                  href={`/gallery/${album.id}`}
                />
              ))}
            </div>

            {albums.totalPages > 1 && (
              <URLPagination page={albums.page} totalPages={albums.totalPages} className="mt-8" />
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
