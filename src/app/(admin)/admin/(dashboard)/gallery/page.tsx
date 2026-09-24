import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { getGalleryAlbums } from '@/lib/data';
import { AlbumRowActions } from './AlbumRowActions';

interface AdminGalleryPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** /admin/gallery — reuses getGalleryAlbums directly (no admin-only filter exists on GalleryAlbum, so one query serves both the public index and this list). */
export default async function AdminGalleryPage({ searchParams }: AdminGalleryPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const albums = await getGalleryAlbums({ page, pageSize: 15 });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Gallery Albums</h1>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Album
          </Button>
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: 'title',
            header: 'Title',
            render: (a) => (
              <Link href={`/admin/gallery/${a.id}/edit`} className="font-medium text-ink hover:text-cyan">
                {a.title}
              </Link>
            ),
          },
          { key: 'images', header: 'Photos', render: (a) => a.imageCount },
          { key: 'order', header: 'Order', render: (a) => a.displayOrder },
          { key: 'actions', header: '', render: (a) => <AlbumRowActions id={a.id} title={a.title} /> },
        ]}
        data={albums.items}
        getRowId={(a) => a.id}
        emptyTitle="No albums yet"
        emptyDescription="Create your first album to get started."
      />

      <URLPagination page={albums.page} totalPages={albums.totalPages} className="mt-4" />
    </div>
  );
}
