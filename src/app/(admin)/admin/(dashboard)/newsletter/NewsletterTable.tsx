'use client';

import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/cms/DataTable';
import { formatDisplayDate } from '@/lib/utils';
import { SubscriberRowActions } from './SubscriberRowActions';
import type { AdminSubscriberRow } from '@/lib/data/newsletter';

export function NewsletterTable({ items }: { items: AdminSubscriberRow[] }) {
  return (
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
      data={items}
      getRowId={(s) => s.id}
      emptyTitle="No subscribers yet"
      emptyDescription="Newsletter signups from the homepage will appear here."
    />
  );
}