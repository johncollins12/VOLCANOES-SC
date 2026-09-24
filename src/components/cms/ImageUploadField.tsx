'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { FileUpload } from '@/components/forms/FileUpload';
import { IconButton } from '@/components/ui/IconButton';

export interface ImageUploadFieldProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  /** Existing uploaded image URLs to show alongside newly-selected files (e.g. when editing a gallery album that already has photos). */
  existingImageUrls?: string[];
  onRemoveExisting?: (url: string) => void;
}

/**
 * Image-specific file upload: wraps FileUpload (drag-drop + file list) and
 * adds a live thumbnail preview grid using local object URLs — so an admin
 * picking a player headshot or gallery photos sees exactly what they
 * selected before hitting Save, without waiting on a round trip to
 * Supabase Storage. The actual upload (src/lib/supabase/storage.ts) still
 * happens in the calling Server Action once the form is submitted.
 */
export function ImageUploadField({
  id,
  label = 'Upload images',
  hint = 'PNG or JPG, up to 5MB each.',
  error,
  multiple = true,
  onFilesSelected,
  existingImageUrls = [],
  onRemoveExisting,
}: ImageUploadFieldProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  function handleFilesSelected(files: File[]) {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(files.map((file) => ({ file, url: URL.createObjectURL(file) })));
    onFilesSelected(files);
  }

  return (
    <div className="flex flex-col gap-3">
      <FileUpload
        id={id}
        label={label}
        hint={hint}
        error={error}
        accept="image/png, image/jpeg, image/webp"
        multiple={multiple}
        onFilesSelected={handleFilesSelected}
      />

      {(existingImageUrls.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {existingImageUrls.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-card bg-surface-muted">
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              {onRemoveExisting && (
                <IconButton
                  icon={X}
                  aria-label="Remove image"
                  size="sm"
                  variant="secondary"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100"
                />
              )}
            </div>
          ))}
          {previews.map((p) => (
            <div key={p.url} className="relative aspect-square overflow-hidden rounded-card bg-surface-muted">
              <Image src={p.url} alt="" fill className="object-cover" sizes="120px" unoptimized />
              <span className="absolute bottom-1 left-1 rounded-sm bg-charcoal/80 px-1.5 text-[10px] font-medium text-white">
                New
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
