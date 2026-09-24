import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { getAdminVideosList } from '@/lib/data';
import { VideoRowActions } from './VideoRowActions';

interface AdminVideosPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** /admin/videos — every video regardless of publish status, unlike the public Video Centre (see getVideosList's publish-filter bug fix comment). */
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

      <DataTable
        columns={[
          {
            key: 'title',
            header: 'Title',
            render: (v) => (
              <Link href={`/admin/videos/${v.id}/edit`} className="font-medium text-ink hover:text-cyan">
                {v.title}
              </Link>
            ),
          },
          { key: 'category', header: 'Category', render: (v) => v.categoryName ?? '—' },
          { key: 'featured', header: 'Featured', render: (v) => (v.isFeatured ? <Badge>Featured</Badge> : '—') },
          {
            key: 'status',
            header: 'Status',
            render: (v) => <Badge variant={v.publishedAt ? 'success' : 'muted'}>{v.publishedAt ? 'Published' : 'Draft'}</Badge>,
          },
          {
            key: 'actions',
            header: '',
            render: (v) => <VideoRowActions id={v.id} title={v.title} isPublished={!!v.publishedAt} />,
          },
        ]}
        data={videos.items}
        getRowId={(v) => v.id}
        emptyTitle="No videos yet"
        emptyDescription="Add your first video to get started."
      />

      <URLPagination page={videos.page} totalPages={videos.totalPages} className="mt-4" />
    </div>
  );
}
