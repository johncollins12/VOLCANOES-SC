import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { getAdminVideosList } from '@/lib/data';
import { VideosTable } from './VideosTable';

interface AdminVideosPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminVideosPage({ searchParams }: AdminVideosPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const videos = await getAdminVideosList({ page, pageSize: 15 });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Videos</h1>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Video
          </Button>
        </Link>
      </div>

      <VideosTable items={videos.items} />

      <URLPagination page={videos.page} totalPages={videos.totalPages} className="mt-4" />
    </div>
  );
}