import { notFound } from 'next/navigation';
import { formatDisplayDate } from '@/lib/utils';
import { getMessageById } from '@/lib/data';
import { markMessageReadAction } from '@/actions/messages.actions';
import { MessageActions } from './MessageActions';

interface MessageDetailPageProps {
  params: Promise<{ id: string }>;
}

/** /admin/messages/[id] — viewing a message marks it read automatically (a real inbox convention), calling the same Server Action the row-level toggle would, directly from this Server Component rather than requiring a client round trip just to flip one flag. */
export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = await params;
  const message = await getMessageById(id);

  if (!message) notFound();

  if (!message.isRead) {
    await markMessageReadAction(id, true);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">{message.subject || 'No subject'}</h1>
          <p className="mt-1 text-sm text-muted">{formatDisplayDate(message.createdAt)}</p>
        </div>
        <MessageActions id={message.id} name={message.fullName} />
      </div>

      <div className="rounded-card border border-border bg-surface-muted p-4 text-sm">
        <p>
          <span className="font-medium text-ink">{message.fullName}</span> ·{' '}
          <a href={`mailto:${message.email}`} className="text-cyan hover:underline">
            {message.email}
          </a>
        </p>
        {message.phone && <p className="mt-0.5 text-muted">{message.phone}</p>}
      </div>

      <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/90">{message.message}</p>
    </div>
  );
}
