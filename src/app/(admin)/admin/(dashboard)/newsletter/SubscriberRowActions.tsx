'use client';

import { useState, useTransition } from 'react';
import { MailX, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin';
import { useToast } from '@/components/feedback/Toast';
import { unsubscribeFromAdminAction, deleteSubscriberAction } from '@/actions/newsletter.actions';

export function SubscriberRowActions({ id, email, isActive }: { id: string; email: string; isActive: boolean }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function unsubscribe() {
    startTransition(async () => {
      const result = await unsubscribeFromAdminAction(id);
      if (result.success) {
        toast({ title: 'Unsubscribed', variant: 'success' });
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {isActive && (
        <IconButton icon={MailX} aria-label="Unsubscribe" size="sm" variant="ghost" onClick={unsubscribe} disabled={isPending} />
      )}
      <IconButton icon={Trash2} aria-label={`Delete ${email}`} size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} />
      <ConfirmDeleteModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} itemLabel={email} action={() => deleteSubscriberAction(id)} />
    </div>
  );
}
