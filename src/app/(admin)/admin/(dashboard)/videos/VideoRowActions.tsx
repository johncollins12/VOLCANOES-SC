'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin';
import { useToast } from '@/components/feedback/Toast';
import { setVideoPublishedAction, deleteVideoAction } from '@/actions/videos.actions';

export function VideoRowActions({ id, title, isPublished }: { id: string; title: string; isPublished: boolean }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function togglePublish() {
    startTransition(async () => {
      const result = await setVideoPublishedAction(id, !isPublished);
      if (result.success) {
        toast({ title: isPublished ? 'Unpublished' : 'Published', variant: 'success' });
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton
        icon={isPublished ? EyeOff : Eye}
        aria-label={isPublished ? 'Unpublish' : 'Publish'}
        size="sm"
        variant="ghost"
        onClick={togglePublish}
        disabled={isPending}
      />
      <IconButton icon={Trash2} aria-label={`Delete ${title}`} size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} />
      <ConfirmDeleteModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} itemLabel={title} action={() => deleteVideoAction(id)} />
    </div>
  );
}
