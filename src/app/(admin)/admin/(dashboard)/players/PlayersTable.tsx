'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { PlayerRowActions } from './PlayerRowActions';
import type { AdminPlayerRow } from '@/lib/data/players';

export function PlayersTable({ items }: { items: AdminPlayerRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (p) => (
            <Link href={`/admin/players/${p.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {p.fullName}
            </Link>
          ),
        },
        { key: 'number', header: '#', render: (p) => p.jerseyNumber ?? '\u2014' },
        { key: 'position', header: 'Position', render: (p) => p.positionName ?? '\u2014' },
        { key: 'nationality', header: 'Nationality', render: (p) => p.nationality ?? '\u2014' },
        {
          key: 'status',
          header: 'Status',
          render: (p) => <Badge variant={p.isActive ? 'success' : 'muted'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>,
        },
        { key: 'actions', header: '', render: (p) => <PlayerRowActions id={p.id} name={p.fullName} isActive={p.isActive} /> },
      ]}
      data={items}
      getRowId={(p) => p.id}
      emptyTitle="No players yet"
      emptyDescription="Add your first player to get started."
    />
  );
}