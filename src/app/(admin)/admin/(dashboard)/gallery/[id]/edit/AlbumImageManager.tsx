'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/cms/ImageUploadField';
import { Input } from '@/components/forms';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Feedback';
import { useToast } from '@/components/feedback/Toast';
import { uploadImageAction } from '@/actions/media.actions';
import { addImagesToAlbumAction, updateImageCaptionAction, deleteImageAction } from '@/actions/gallery.actions';

interface AlbumImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

/**
 * Photo management for one album — upload (via the shared
 * uploadImageAction, same as every other admin upload), per-photo caption
 * editing (saved on blur, not on every keystroke), and delete. Kept as its
 * own client island on the edit page rather than folded into AlbumForm,
 * since it manages a live list of already-persisted images independently
 * of the album metadata form's own submit/redirect cycle.
 */
export function AlbumImageManager({ albumId, images }: { albumId: string; images: AlbumImage[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleUpload(files: File[]) {
    if (files.length === 0) return;

    startTransition(async () => {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.set('file', file);
        const result = await uploadImageAction('gallery', formData);
        if (result.success) {
          uploadedUrls.push(result.url);
        } else {
          toast({ title: 'Upload failed', description: result.error, variant: 'error' });
        }
      }

      if (uploadedUrls.length > 0) {
        const result = await addImagesToAlbumAction(albumId, uploadedUrls);
        if (result.success) {
          toast({ title: `${uploadedUrls.length} photo(s) added`, variant: 'success' });
        } else {
          toast({ title: 'Could not add photos', description: result.error, variant: 'error' });
        }
      }
    });
  }

  function handleCaptionBlur(imageId: string, caption: string) {
    startTransition(async () => {
      await updateImageCaptionAction(imageId, caption);
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await deleteImageAction(imageId);
      if (result.success) {
        toast({ title: 'Photo removed', variant: 'success' });
      } else {
        toast({ title: 'Could not remove photo', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ImageUploadField id="album-photos" label="Add Photos" hint="You can select multiple files at once." onFilesSelected={handleUpload} />
      {isPending && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Spinner className="h-4 w-4" /> Working…
        </p>
      )}

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="rounded-card border border-border bg-surface p-2">
              <div className="relative aspect-square overflow-hidden rounded-card bg-surface-muted">
                <Image src={image.imageUrl} alt={image.caption ?? ''} fill className="object-cover" sizes="240px" />
                <IconButton
                  icon={Trash2}
                  aria-label="Delete photo"
                  size="sm"
                  variant="secondary"
                  className="absolute right-1.5 top-1.5"
                  onClick={() => handleDelete(image.id)}
                />
              </div>
              <div className="mt-2">
                <Input
                  id={`caption-${image.id}`}
                  label="Caption"
                  defaultValue={image.caption ?? ''}
                  onBlur={(e) => handleCaptionBlur(image.id, e.target.value)}
                  placeholder="Optional caption"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
