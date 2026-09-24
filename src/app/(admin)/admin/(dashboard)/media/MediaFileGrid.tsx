'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Copy } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDeleteModal } from '@/components/admin';
import { EmptyState } from '@/components/ui/Feedback';
import { useToast } from '@/components/feedback/Toast';
import { deleteMediaFileAction } from '@/actions/media.actions';
import type { MediaFile } from '@/lib/data/media-library';
import type { StorageBucket } from '@/lib/supabase/storage';

export function MediaFileGrid({ bucket, files }: { bucket: StorageBucket; files: MediaFile[] }) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const { toast } = useToast();

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast({ title: 'URL copied', variant: 'success' });
  }

  if (files.length === 0) {
    return <EmptyState title="No files in this bucket" description="Uploads from other admin forms will appear here." />;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {files.map((file) => (
        <div key={file.name} className="group relative aspect-square overflow-hidden rounded-card border border-border bg-surface-muted">
          <Image src={file.publicUrl} alt={file.name} fill className="object-cover" sizes="150px" />
          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-charcoal/0 opacity-0 transition-all group-hover:bg-charcoal/50 group-hover:opacity-100">
            <IconButton icon={Copy} aria-label="Copy URL" size="sm" variant="secondary" onClick={() => copyUrl(file.publicUrl)} />
            <IconButton
              icon={Trash2}
              aria-label={`Delete ${file.name}`}
              size="sm"
              variant="secondary"
              onClick={() => setPendingDelete(file.name)}
            />
          </div>
        </div>
      ))}

      <ConfirmDeleteModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        itemLabel={pendingDelete ?? ''}
        action={() => deleteMediaFileAction(bucket, pendingDelete!)}
      />
    </div>
  );
}
