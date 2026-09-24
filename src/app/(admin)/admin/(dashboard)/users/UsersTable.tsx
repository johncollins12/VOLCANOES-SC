'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { UserRowActions } from './UserRowActions';
import type { AdminUserRow } from '@/lib/data/users';

interface UsersTableProps {
  items: AdminUserRow[];
  currentUserId: string | undefined;
}

export function UsersTable({ items, currentUserId }: UsersTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (u) => (
            <Link href={`/admin/users/${u.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {u.fullName}
            </Link>
          ),
        },
        { key: 'email', header: 'Email', render: (u) => u.email },
        {
          key: 'roles',
          header: 'Roles',
          render: (u) => (
            <div className="flex flex-wrap gap-1">
              {u.roles.map((r) => (
                <Badge key={r} variant="muted">
                  {r}
                </Badge>
              ))}
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (u) => <Badge variant={u.isActive ? 'success' : 'muted'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>,
        },
        {
          key: 'actions',
          header: '',
          render: (u) => <UserRowActions id={u.id} name={u.fullName} isActive={u.isActive} isSelf={u.id === currentUserId} />,
        },
      ]}
      data={items}
      getRowId={(u) => u.id}
      emptyTitle="No staff accounts yet"
      emptyDescription="Create your first staff account to get started."
    />
  );
}