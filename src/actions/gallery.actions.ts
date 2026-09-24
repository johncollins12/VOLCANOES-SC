'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { nonEmptyString } from '@/lib/validation/common';
import type { ActionResult } from '@/types';

const albumSchema = z.object({
  title: nonEmptyString('Title'),
  description: z.string().trim().optional(),
  coverImageUrl: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

function parseAlbumFormData(formData: FormData) {
  return albumSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    coverImageUrl: formData.get('coverImageUrl') || undefined,
    displayOrder: formData.get('displayOrder') || undefined,
  });
}

export async function createAlbumAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  const parsed = parseAlbumFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const album = await prisma.galleryAlbum.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      coverImageUrl: parsed.data.coverImageUrl || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/gallery');
  redirect(`/admin/gallery/${album.id}/edit`);
}

export async function updateAlbumAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  const parsed = parseAlbumFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.galleryAlbum.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      coverImageUrl: parsed.data.coverImageUrl || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/gallery');
  revalidatePath(`/gallery/${id}`);
  revalidatePath('/gallery');
  return { success: true, data: undefined };
}

export async function deleteAlbumAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  try {
    // Images belong to the album (GalleryImage.albumId has no onDelete
    // cascade in the schema), so they're deleted explicitly first —
    // otherwise the album delete would fail on the foreign key.
    await prisma.galleryImage.deleteMany({ where: { albumId: id } });
    await prisma.galleryAlbum.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this album.' };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return { success: true, data: undefined };
}

/** Adds one or more already-uploaded images (URLs from AdminImageUpload/ImageUploadField) to an album. */
export async function addImagesToAlbumAction(albumId: string, imageUrls: string[]): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  if (imageUrls.length === 0) {
    return { success: false, error: 'No images to add.' };
  }

  await prisma.galleryImage.createMany({
    data: imageUrls.map((imageUrl) => ({ albumId, imageUrl })),
  });

  revalidatePath(`/admin/gallery/${albumId}/edit`);
  revalidatePath(`/gallery/${albumId}`);
  return { success: true, data: undefined };
}

export async function updateImageCaptionAction(imageId: string, caption: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  const image = await prisma.galleryImage.update({
    where: { id: imageId },
    data: { caption: caption || null },
    select: { albumId: true },
  });

  revalidatePath(`/admin/gallery/${image.albumId}/edit`);
  revalidatePath(`/gallery/${image.albumId}`);
  return { success: true, data: undefined };
}

export async function deleteImageAction(imageId: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  try {
    const image = await prisma.galleryImage.delete({ where: { id: imageId }, select: { albumId: true } });
    revalidatePath(`/admin/gallery/${image.albumId}/edit`);
    revalidatePath(`/gallery/${image.albumId}`);
  } catch {
    return { success: false, error: 'Could not delete this image.' };
  }

  return { success: true, data: undefined };
}
