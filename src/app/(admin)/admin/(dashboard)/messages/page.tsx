import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { AdminSearchBox } from '@/components/cms/AdminSearchBox';
import { getAdminMessagesList } from '@/lib/data';
import { MessagesTable } from './MessagesTable';

interface AdminMessagesPageProps {
  searchParams: Promise<{ page?: string; q?: string; unread?: string }>;
}

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

      <MessagesTable items={messages.items} />

      <URLPagination page={messages.page} totalPages={messages.totalPages} className="mt-4" />
    </div>
  );
}