'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { SponsorRowActions } from './SponsorRowActions';
import type { AdminSponsorRow } from '@/lib/data/sponsors';

export function SponsorsTable({ items }: { items: AdminSponsorRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (s) => (
            <Link href={`/admin/sponsors/${s.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {s.name}
            </Link>
          ),
        },
        { key: 'tier', header: 'Tier', render: (s) => s.tierName ?? '\u2014' },
        { key: 'order', header: 'Order', render: (s) => s.displayOrder },
        {
          key: 'status',
          header: 'Status',
          render: (s) => <Badge variant={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>,
        },
        { key: 'actions', header: '', render: (s) => <SponsorRowActions id={s.id} name={s.name} isActive={s.isActive} /> },
      ]}
      data={items}
      getRowId={(s) => s.id}
      emptyTitle="No sponsors yet"
      emptyDescription="Add your first sponsor to get started."
    />
  );
}