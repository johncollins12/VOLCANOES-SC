import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/cms/DataTable';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { formatDisplayDate } from '@/lib/utils';
import { getAdminMessagesList } from '@/lib/data';

interface AdminMessagesPageProps {
  searchParams: Promise<{ page?: string; q?: string; unread?: string }>;
}

/** /admin/messages — contact form submissions. Read/unread state and full message body live on the detail page (viewing a message marks it read). */
export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  const { page: pageParam, q, unread } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const unreadOnly = unread === '1';

  const messages = await getAdminMessagesList({ page, pageSize: 15, query: q, unreadOnly });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Messages</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1">
          <AdminSearchBox placeholder="Search messages…" />
        </div>
        <Link href={unreadOnly ? '/admin/messages' : '/admin/messages?unread=1'}>
          <Button variant={unreadOnly ? 'primary' : 'outline'} size="sm">
            {unreadOnly ? 'Showing unread only' : 'Unread only'}
          </Button>
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: 'from',
            header: 'From',
            render: (m) => (
              <Link href={`/admin/messages/${m.id}`} className={m.isRead ? 'text-ink hover:text-cyan' : 'font-semibold text-ink hover:text-cyan'}>
                {m.fullName}
              </Link>
            ),
          },
          { key: 'email', header: 'Email', render: (m) => m.email },
          { key: 'subject', header: 'Subject', render: (m) => m.subject ?? '—' },
          { key: 'date', header: 'Received', render: (m) => formatDisplayDate(m.createdAt) },
          {
            key: 'status',
            header: 'Status',
            render: (m) => <Badge variant={m.isRead ? 'muted' : 'default'}>{m.isRead ? 'Read' : 'Unread'}</Badge>,
          },
        ]}
        data={messages.items}
        getRowId={(m) => m.id}
        emptyTitle="No messages"
        emptyDescription="Contact form submissions will appear here."
      />

      <URLPagination page={messages.page} totalPages={messages.totalPages} className="mt-4" />
    </div>
  );
}
