'use client';

import Link from 'next/link';
import { DataTable } from '@/components/cms/DataTable';
import { AlbumRowActions } from './AlbumRowActions';
import type { GalleryAlbumSummary } from '@/lib/data/gallery';

export function GalleryTable({ items }: { items: GalleryAlbumSummary[] }) {
  return (
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
      data={items}
      getRowId={(a) => a.id}
      emptyTitle="No albums yet"
      emptyDescription="Create your first album to get started."
    />
  );
}