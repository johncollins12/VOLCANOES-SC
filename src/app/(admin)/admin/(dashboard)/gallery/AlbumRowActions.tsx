'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin';
import { deleteAlbumAction } from '@/actions/gallery.actions';

export function AlbumRowActions({ id, title }: { id: string; title: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton icon={Trash2} aria-label={`Delete ${title}`} size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} />
      <ConfirmDeleteModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} itemLabel={title} action={() => deleteAlbumAction(id)} />
    </div>
  );
}
