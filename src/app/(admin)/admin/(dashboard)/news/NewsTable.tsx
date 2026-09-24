'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { formatDisplayDate } from '@/lib/utils';
import { NewsRowActions } from './NewsRowActions';
import type { AdminNewsRow } from '@/lib/data/news';

const STATUS_BADGE: Record<string, 'success' | 'muted' | 'default'> = {
  PUBLISHED: 'success',
  DRAFT: 'muted',
};

export function NewsTable({ items }: { items: AdminNewsRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'title',
          header: 'Title',
          render: (a) => (
            <Link href={`/admin/news/${a.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {a.title}
            </Link>
          ),
        },
        { key: 'category', header: 'Category', render: (a) => a.categoryName ?? '—' },
        { key: 'author', header: 'Author', render: (a) => a.authorName ?? '—' },
        { key: 'status', header: 'Status', render: (a) => <Badge variant={STATUS_BADGE[a.status] ?? 'default'}>{a.status}</Badge> },
        { key: 'updated', header: 'Updated', render: (a) => formatDisplayDate(a.updatedAt) },
        { key: 'actions', header: '', render: (a) => <NewsRowActions id={a.id} title={a.title} status={a.status} /> },
      ]}
      data={items}
      getRowId={(a) => a.id}
      emptyTitle="No news yet"
      emptyDescription="Create your first article to get started."
    />
  );
}