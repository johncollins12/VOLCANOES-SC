'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { StaffRowActions } from './StaffRowActions';
import type { AdminStaffRow } from '@/lib/data/staff';

export function StaffTable({ items }: { items: AdminStaffRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (s) => (
            <Link href={`/admin/staff/${s.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {s.fullName}
            </Link>
          ),
        },
        { key: 'role', header: 'Role', render: (s) => s.role },
        { key: 'category', header: 'Category', render: (s) => s.categoryName },
        {
          key: 'status',
          header: 'Status',
          render: (s) => <Badge variant={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>,
        },
        { key: 'actions', header: '', render: (s) => <StaffRowActions id={s.id} name={s.fullName} isActive={s.isActive} /> },
      ]}
      data={items}
      getRowId={(s) => s.id}
      emptyTitle="No staff yet"
      emptyDescription="Add your first staff member to get started."
    />
  );
}