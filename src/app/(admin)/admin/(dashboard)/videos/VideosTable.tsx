'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { VideoRowActions } from './VideoRowActions';
import type { AdminVideoRow } from '@/lib/data/videos';

export function VideosTable({ items }: { items: AdminVideoRow[] }) {
  return (
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
        { key: 'category', header: 'Category', render: (v) => v.categoryName ?? '\u2014' },
        { key: 'featured', header: 'Featured', render: (v) => (v.isFeatured ? <Badge>Featured</Badge> : '\u2014') },
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
      data={items}
      getRowId={(v) => v.id}
      emptyTitle="No videos yet"
      emptyDescription="Add your first video to get started."
    />
  );
}