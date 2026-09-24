import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminPlayersList } from '@/lib/data';
import { PlayerRowActions } from './PlayerRowActions';

interface AdminPlayersPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

/** /admin/players — squad list including inactive players (see getAdminPlayersList's comment on why). */
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

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (p) => (
              <Link href={`/admin/players/${p.id}/edit`} className="font-medium text-ink hover:text-cyan">
                {p.fullName}
              </Link>
            ),
          },
          { key: 'number', header: '#', render: (p) => p.jerseyNumber ?? '—' },
          { key: 'position', header: 'Position', render: (p) => p.positionName ?? '—' },
          { key: 'nationality', header: 'Nationality', render: (p) => p.nationality ?? '—' },
          {
            key: 'status',
            header: 'Status',
            render: (p) => <Badge variant={p.isActive ? 'success' : 'muted'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>,
          },
          { key: 'actions', header: '', render: (p) => <PlayerRowActions id={p.id} name={p.fullName} isActive={p.isActive} /> },
        ]}
        data={players.items}
        getRowId={(p) => p.id}
        emptyTitle="No players yet"
        emptyDescription="Add your first player to get started."
      />

      <URLPagination page={players.page} totalPages={players.totalPages} className="mt-4" />
    </div>
  );
}
