import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { GalleryLightbox } from '@/components/media/GalleryLightbox';
import { getAlbumById, getAllAlbumIds } from '@/lib/data';

export const revalidate = 300;

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllAlbumIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  const album = await getAlbumById(id);

  if (!album) {
    return buildPageMetadata({
      title: 'Album Not Found',
      description: 'This photo album could not be found.',
      path: `/gallery/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: album.title,
    description: album.description ?? `Photos from ${album.title}.`,
    path: `/gallery/${album.id}`,
    ogImage: album.images[0]?.imageUrl,
  });
}

/**
 * /gallery/[id] — full album. The grid + lightbox viewer is entirely
 * GalleryLightbox (media module); this page is just data-fetching plus
 * the title/description header.
 */
export default async function GalleryAlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = await getAlbumById(id);

  if (!album) notFound();

  return (
    <Section>
      <Container>
        <h1 className="font-display text-3xl font-semibold text-ink">{album.title}</h1>
        {album.description && <p className="mt-2 max-w-2xl text-sm text-muted">{album.description}</p>}

        <div className="mt-6">
          <GalleryLightbox images={album.images} />
        </div>
      </Container>
    </Section>
  );
}
