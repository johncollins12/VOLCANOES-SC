import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminStaffList } from '@/lib/data';
import { StaffRowActions } from './StaffRowActions';

interface AdminStaffPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

/** /admin/staff — management, technical, medical, and administration staff in one list, grouped by category then display order. */
export default async function AdminStaffPage({ searchParams }: AdminStaffPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const staff = await getAdminStaffList({ page, pageSize: 15, query: q });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Staff</h1>
        <Link href="/admin/staff/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Staff Member
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
        data={staff.items}
        getRowId={(s) => s.id}
        emptyTitle="No staff yet"
        emptyDescription="Add your first staff member to get started."
      />

      <URLPagination page={staff.page} totalPages={staff.totalPages} className="mt-4" />
    </div>
  );
}
