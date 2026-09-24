import Link from 'next/link';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { formatDisplayDate } from '@/lib/utils';
import { getAdminSubscribersList, getSubscriberStats } from '@/lib/data';
import { SubscriberRowActions } from './SubscriberRowActions';

interface AdminNewsletterPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminNewsletterPage({ searchParams }: AdminNewsletterPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [subscribers, stats] = await Promise.all([
    getAdminSubscribersList({ page, pageSize: 15, query: q }),
    getSubscriberStats(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Newsletter Subscribers</h1>
        <Link href="/api/newsletter/export">
          <Button variant="outline">
            <Download className="h-4 w-4" aria-hidden />
            Export Active (CSV)
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4 sm:max-w-md">
        <StatisticCard label="Total" value={stats.total} />
        <StatisticCard label="Active" value={stats.active} />
        <StatisticCard label="Unsubscribed" value={stats.unsubscribed} />
      </div>

      <div className="mb-4 max-w-xs">
        <AdminSearchBox placeholder="Search by email…" />
      </div>

      <DataTable
        columns={[
          { key: 'email', header: 'Email', render: (s) => s.email },
          { key: 'subscribed', header: 'Subscribed', render: (s) => formatDisplayDate(s.subscribedAt) },
          {
            key: 'status',
            header: 'Status',
            render: (s) => <Badge variant={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Unsubscribed'}</Badge>,
          },
          { key: 'actions', header: '', render: (s) => <SubscriberRowActions id={s.id} email={s.email} isActive={s.isActive} /> },
        ]}
        data={subscribers.items}
        getRowId={(s) => s.id}
        emptyTitle="No subscribers yet"
        emptyDescription="Newsletter signups from the homepage will appear here."
      />

      <URLPagination page={subscribers.page} totalPages={subscribers.totalPages} className="mt-4" />
    </div>
  );
}
