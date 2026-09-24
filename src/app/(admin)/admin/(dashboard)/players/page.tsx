import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminPlayersList } from '@/lib/data';
import { PlayersTable } from './PlayersTable';

interface AdminPlayersPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminPlayersPage({ searchParams }: AdminPlayersPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const players = await getAdminPlayersList({ page, pageSize: 15, query: q });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Players</h1>
        <Link href="/admin/players/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Player
          </Button>
        </Link>
      </div>

      <div className="mb-4 max-w-xs">
        <AdminSearchBox placeholder="Search players…" />
      </div>

      <PlayersTable items={players.items} />

      <URLPagination page={players.page} totalPages={players.totalPages} className="mt-4" />
    </div>
  );
}