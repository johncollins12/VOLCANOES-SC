'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { formatDisplayDate, formatKickoffTime } from '@/lib/utils';
import { FixtureRowActions } from './FixtureRowActions';
import type { AdminFixtureRow } from '@/lib/data/fixtures';

const STATUS_BADGE: Record<string, 'default' | 'success' | 'live' | 'muted'> = {
  SCHEDULED: 'default',
  LIVE: 'live',
  FULL_TIME: 'success',
  POSTPONED: 'muted',
  CANCELLED: 'muted',
};

export function FixturesTable({ items }: { items: AdminFixtureRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'match',
          header: 'Match',
          render: (f) => (
            <Link href={`/admin/fixtures/${f.id}/edit`} className="font-medium text-ink hover:text-cyan">
              {f.homeTeamName} vs {f.awayTeamName}
            </Link>
          ),
        },
        { key: 'competition', header: 'Competition', render: (f) => f.competitionName },
        {
          key: 'kickoff',
          header: 'Kickoff',
          render: (f) => `${formatDisplayDate(f.kickoffAt)}, ${formatKickoffTime(f.kickoffAt)}`,
        },
        {
          key: 'score',
          header: 'Score',
          render: (f) => (f.homeScore != null && f.awayScore != null ? `${f.homeScore}\u2013${f.awayScore}` : '\u2014'),
        },
        { key: 'status', header: 'Status', render: (f) => <Badge variant={STATUS_BADGE[f.status] ?? 'default'}>{f.status}</Badge> },
        {
          key: 'report',
          header: '',
          render: (f) =>
            f.status === 'FULL_TIME' ? (
              <Link href={`/admin/match-reports/${f.id}/edit`} className="text-sm font-medium text-cyan hover:underline">
                Report
              </Link>
            ) : null,
        },
        {
          key: 'actions',
          header: '',
          render: (f) => <FixtureRowActions id={f.id} label={`${f.homeTeamName} vs ${f.awayTeamName}`} />,
        },
      ]}
      data={items}
      getRowId={(f) => f.id}
      emptyTitle="No fixtures yet"
      emptyDescription="Add your first fixture to get started."
    />
  );
}