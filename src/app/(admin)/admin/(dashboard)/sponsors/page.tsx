import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { getAdminSponsorsList } from '@/lib/data';
import { SponsorsTable } from './SponsorsTable';

interface AdminSponsorsPageProps {
  searchParams: Promise<{ page?: string }>;
}

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

      <SponsorsTable items={sponsors.items} />

      <URLPagination page={sponsors.page} totalPages={sponsors.totalPages} className="mt-4" />
    </div>
  );
}