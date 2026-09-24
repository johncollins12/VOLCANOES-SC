'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ImageUploadField } from '@/components/cms/ImageUploadField';
import { Spinner } from '@/components/ui/Feedback';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/components/feedback/Toast';
import { uploadImageAction } from '@/actions/media.actions';
import type { StorageBucket } from '@/lib/supabase/storage';

interface AdminImageUploadProps {
  bucket: StorageBucket;
  name: string;
  label: string;
  hint?: string;
  initialUrl?: string | null;
}

/**
 * The single image-upload field every admin form uses (news cover, player/
 * staff photo, sponsor logo). Uploads immediately on file selection (via
 * uploadImageAction), then carries the resulting URL as a plain hidden
 * <input name="..."> — so the surrounding form's own submit (a normal
 * Server Action reading FormData) just sees a string field, with no
 * special multipart handling needed anywhere else.
 */
export function AdminImageUpload({ bucket, name, label, hint, initialUrl }: AdminImageUploadProps) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set('file', file);
      const result = await uploadImageAction(bucket, formData);
      if (result.success) {
        setUrl(result.url);
      } else {
        toast({ title: 'Upload failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-card border border-border bg-surface-muted">
          <Image src={url} alt="" fill className="object-cover" sizes="384px" />
          <IconButton
            icon={X}
            aria-label="Remove image"
            size="sm"
            variant="secondary"
            className="absolute right-2 top-2"
            onClick={() => setUrl('')}
            type="button"
          />
        </div>
      ) : (
        <ImageUploadField id={name} label={label} hint={hint} multiple={false} onFilesSelected={handleFiles} />
      )}

      {isPending && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Spinner className="h-4 w-4" /> Uploading…
        </p>
      )}
    </div>
  );
}
