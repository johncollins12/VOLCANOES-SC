import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { getGalleryAlbums } from '@/lib/data';
import { GalleryTable } from './GalleryTable';

interface AdminGalleryPageProps {
  searchParams: Promise<{ page?: string }>;
}

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

      <GalleryTable items={albums.items} />

      <URLPagination page={albums.page} totalPages={albums.totalPages} className="mt-4" />
    </div>
  );
}