'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { useToast } from '@/components/feedback/Toast';
import { setNewsArticleStatusAction, deleteNewsArticleAction } from '@/actions/news.actions';

interface NewsRowActionsProps {
  id: string;
  title: string;
  status: string;
}

/** Publish/unpublish toggle + delete for one news row in the admin DataTable — see ConfirmDeleteModal for why delete is one shared dialog rather than per-module. */
export function NewsRowActions({ id, title, status }: NewsRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function toggleStatus() {
    const nextStatus = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    startTransition(async () => {
      const result = await setNewsArticleStatusAction(id, nextStatus);
      if (result.success) {
        toast({ title: nextStatus === 'PUBLISHED' ? 'Published' : 'Unpublished', variant: 'success' });
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton
        icon={status === 'PUBLISHED' ? EyeOff : Eye}
        aria-label={status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
        size="sm"
        variant="ghost"
        onClick={toggleStatus}
        disabled={isPending}
      />
      <IconButton
        icon={Trash2}
        aria-label={`Delete ${title}`}
        size="sm"
        variant="ghost"
        onClick={() => setConfirmOpen(true)}
      />
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        itemLabel={title}
        action={() => deleteNewsArticleAction(id)}
      />
    </div>
  );
}
