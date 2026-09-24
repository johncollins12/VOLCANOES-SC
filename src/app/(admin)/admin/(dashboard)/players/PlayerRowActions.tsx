'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin';
import { useToast } from '@/components/feedback/Toast';
import { togglePlayerActiveAction, deletePlayerAction } from '@/actions/players.actions';

interface PlayerRowActionsProps {
  id: string;
  name: string;
  isActive: boolean;
}

export function PlayerRowActions({ id, name, isActive }: PlayerRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function toggleActive() {
    startTransition(async () => {
      const result = await togglePlayerActiveAction(id, !isActive);
      if (result.success) {
        toast({ title: isActive ? 'Player deactivated' : 'Player activated', variant: 'success' });
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton
        icon={isActive ? EyeOff : Eye}
        aria-label={isActive ? 'Deactivate' : 'Activate'}
        size="sm"
        variant="ghost"
        onClick={toggleActive}
        disabled={isPending}
      />
      <IconButton icon={Trash2} aria-label={`Delete ${name}`} size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} />
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        itemLabel={name}
        action={() => deletePlayerAction(id)}
      />
    </div>
  );
}
