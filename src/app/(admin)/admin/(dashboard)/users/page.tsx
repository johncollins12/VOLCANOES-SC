import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminUsersList } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth/session';
import { UsersTable } from './UsersTable';

interface AdminUsersPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

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

      <UsersTable items={users.items} currentUserId={currentUser?.id} />

      <URLPagination page={users.page} totalPages={users.totalPages} className="mt-4" />
    </div>
  );
}