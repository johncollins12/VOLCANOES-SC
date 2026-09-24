import Link from 'next/link';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminSubscribersList, getSubscriberStats } from '@/lib/data';
import { NewsletterTable } from './NewsletterTable';

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

      <NewsletterTable items={subscribers.items} />

      <URLPagination page={subscribers.page} totalPages={subscribers.totalPages} className="mt-4" />
    </div>
  );
}