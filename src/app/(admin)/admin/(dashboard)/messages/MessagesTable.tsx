'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { formatDisplayDate } from '@/lib/utils';
import type { AdminMessageRow } from '@/lib/data/messages';

export function MessagesTable({ items }: { items: AdminMessageRow[] }) {
  return (
    <DataTable
      columns={[
        {
          key: 'from',
          header: 'From',
          render: (m) => (
            <Link
              href={`/admin/messages/${m.id}`}
              className={m.isRead ? 'text-ink hover:text-cyan' : 'font-semibold text-ink hover:text-cyan'}
            >
              {m.fullName}
            </Link>
          ),
        },
        { key: 'email', header: 'Email', render: (m) => m.email },
        { key: 'subject', header: 'Subject', render: (m) => m.subject ?? '\u2014' },
        { key: 'date', header: 'Received', render: (m) => formatDisplayDate(m.createdAt) },
        {
          key: 'status',
          header: 'Status',
          render: (m) => <Badge variant={m.isRead ? 'muted' : 'default'}>{m.isRead ? 'Read' : 'Unread'}</Badge>,
        },
      ]}
      data={items}
      getRowId={(m) => m.id}
      emptyTitle="No messages"
      emptyDescription="Contact form submissions will appear here."
    />
  );
}