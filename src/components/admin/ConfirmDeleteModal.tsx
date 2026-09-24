'use client';

import { useState, useTransition } from 'react';
import { Modal } from '@/components/feedback/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemLabel: string;
  /** Server Action bound to the specific row's id via .bind(null, id) at the call site. */
  action: () => Promise<{ success: boolean; error?: string }>;
  onDeleted?: () => void;
}

/**
 * The one delete-confirmation dialog for every admin module (news,
 * fixtures, players, staff, sponsors, gallery albums, videos, users...).
 * Built from the existing Modal + Button + Toast — no per-entity
 * confirmation dialog needed, since "are you sure you want to delete X?"
 * is identical logic everywhere; only `itemLabel` and `action` change.
 */
export function ConfirmDeleteModal({ isOpen, onClose, itemLabel, action, onDeleted }: ConfirmDeleteModalProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast({ title: 'Deleted', description: `${itemLabel} was removed.`, variant: 'success' });
        onDeleted?.();
        onClose();
      } else {
        toast({ title: 'Delete failed', description: result.error ?? 'Please try again.', variant: 'error' });
      }
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm deletion" size="sm">
      <p className="text-sm text-muted">
        Are you sure you want to delete <span className="font-medium text-ink">{itemLabel}</span>? This cannot be
        undone.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isPending}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
