import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { getAdminSponsorsList } from '@/lib/data';
import { SponsorRowActions } from './SponsorRowActions';

interface AdminSponsorsPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** /admin/sponsors — ordered by tier rank then displayOrder, matching the public sponsors strip exactly. */
export default async function AdminSponsorsPage({ searchParams }: AdminSponsorsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const sponsors = await getAdminSponsorsList({ page, pageSize: 15 });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Sponsors</h1>
        <Link href="/admin/sponsors/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Sponsor
          </Button>
        </Link>
      </div>

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
          { key: 'tier', header: 'Tier', render: (s) => s.tierName ?? '—' },
          { key: 'order', header: 'Order', render: (s) => s.displayOrder },
          {
            key: 'status',
            header: 'Status',
            render: (s) => <Badge variant={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>,
          },
          { key: 'actions', header: '', render: (s) => <SponsorRowActions id={s.id} name={s.name} isActive={s.isActive} /> },
        ]}
        data={sponsors.items}
        getRowId={(s) => s.id}
        emptyTitle="No sponsors yet"
        emptyDescription="Add your first sponsor to get started."
      />

      <URLPagination page={sponsors.page} totalPages={sponsors.totalPages} className="mt-4" />
    </div>
  );
}
