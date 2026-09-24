'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDeleteModal } from '@/components/admin';
import { useToast } from '@/components/feedback/Toast';
import { markMessageReadAction, deleteMessageAction } from '@/actions/messages.actions';

export function MessageActions({ id, name }: { id: string; name: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function markUnread() {
    startTransition(async () => {
      const result = await markMessageReadAction(id, false);
      if (result.success) {
        toast({ title: 'Marked as unread', variant: 'success' });
        router.push('/admin/messages');
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={markUnread} isLoading={isPending}>
        <Mail className="h-4 w-4" aria-hidden />
        Mark Unread
      </Button>
      <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="h-4 w-4" aria-hidden />
        Delete
      </Button>
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        itemLabel={`the message from ${name}`}
        action={() => deleteMessageAction(id)}
        onDeleted={() => router.push('/admin/messages')}
      />
    </div>
  );
}
