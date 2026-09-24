'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { deleteFixtureAction } from '@/actions/fixtures.actions';

export function FixtureRowActions({ id, label }: { id: string; label: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton icon={Trash2} aria-label={`Delete ${label}`} size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} />
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        itemLabel={label}
        action={() => deleteFixtureAction(id)}
      />
    </div>
  );
}
