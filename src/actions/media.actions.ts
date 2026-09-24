'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { uploadPublicFile, type StorageBucket } from '@/lib/supabase/storage';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/types';

export type UploadImageResult = { success: true; url: string } | { success: false; error: string };

/**
 * Generic "upload one image, get back a public URL" action — shared by
 * every admin form that needs an image (news cover, player/staff photo,
 * sponsor logo, gallery photos, video thumbnails) instead of each module
 * reimplementing this.
 *
 * Why this exists as a separate step rather than part of each entity's
 * create/update action: ImageUploadField (components/cms/ImageUploadField.tsx)
 * intentionally only collects File objects and previews them — its
 * underlying file input has no `name` attribute, so it can't ride along
 * in a native form submission. AdminImageUpload (components/admin/) calls
 * this action as soon as a file is chosen and stores the resulting URL in
 * a hidden field, so by the time the surrounding form actually submits,
 * every field — including the image — is a plain string in FormData.
 */
export async function uploadImageAction(bucket: StorageBucket, formData: FormData): Promise<UploadImageResult> {
  await requireUser(); // any authenticated staff member may upload; per-entity role checks happen in that entity's own create/update action

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No file provided.' };
  }
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Only image files are supported.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Image must be under 5MB.' };
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const result = await uploadPublicFile(bucket, path, file);
  if ('error' in result) {
    return { success: false, error: result.error };
  }

  return { success: true, url: result.publicUrl };
}

/**
 * Deletes a file directly from Supabase Storage, for the Media Library
 * browser (/admin/media). IMPORTANT LIMITATION, documented rather than
 * silently ignored: this only removes the file from Storage — it does
 * NOT check whether any NewsArticle.coverImageUrl, Player.photoUrl, etc.
 * still references this exact URL. There's no reverse index from a
 * Storage object back to the DB rows using it (see listMediaFiles'
 * comment on why there's no Asset table), so deleting a file that's
 * still referenced somewhere will leave a broken image on that page.
 * Gated to MEDIA_MANAGER/SUPER_ADMIN for that reason.
 */
export async function deleteMediaFileAction(bucket: StorageBucket, fileName: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER, ROLES.SUPER_ADMIN);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(bucket).remove([fileName]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/media');
  return { success: true, data: undefined };
}
