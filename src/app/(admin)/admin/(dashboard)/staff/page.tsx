import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminStaffList } from '@/lib/data';
import { StaffTable } from './StaffTable';

interface AdminStaffPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

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

      <StaffTable items={staff.items} />

      <URLPagination page={staff.page} totalPages={staff.totalPages} className="mt-4" />
    </div>
  );
}