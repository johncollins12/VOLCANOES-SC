import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminUsersList } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth/session';
import { UserRowActions } from './UserRowActions';

interface AdminUsersPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

/** /admin/users — staff accounts, roles, and activation status. Per architecture §5, gated to SUPER_ADMIN only (the real gate is in each Server Action; nav visibility is cosmetic). */
export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [users, currentUser] = await Promise.all([getAdminUsersList({ page, pageSize: 15, query: q }), getCurrentUser()]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Staff Accounts</h1>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Account
          </Button>
        </Link>
      </div>

      <div className="mb-4 max-w-xs">
        <AdminSearchBox placeholder="Search staff…" />
      </div>

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
            render: (u) => <UserRowActions id={u.id} name={u.fullName} isActive={u.isActive} isSelf={u.id === currentUser?.id} />,
          },
        ]}
        data={users.items}
        getRowId={(u) => u.id}
        emptyTitle="No staff accounts yet"
        emptyDescription="Create your first staff account to get started."
      />

      <URLPagination page={users.page} totalPages={users.totalPages} className="mt-4" />
    </div>
  );
}
