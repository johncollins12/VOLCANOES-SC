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

const videoSchema = z.object({
  title: nonEmptyString('Title'),
  description: z.string().trim().optional(),
  provider: z.enum(['YOUTUBE', 'VIMEO', 'SUPABASE_STORAGE']),
  externalUrl: z.string().trim().optional(),
  thumbnailUrl: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
});

function parseFormData(formData: FormData) {
  return videoSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    provider: formData.get('provider'),
    externalUrl: formData.get('externalUrl') || undefined,
    thumbnailUrl: formData.get('thumbnailUrl') || undefined,
    categoryId: formData.get('categoryId') || undefined,
    isFeatured: formData.get('isFeatured') === 'on',
  });
}

export async function createVideoAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.videoEntry.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      provider: parsed.data.provider,
      externalUrl: parsed.data.externalUrl || null,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      categoryId: parsed.data.categoryId || null,
      isFeatured: parsed.data.isFeatured ?? false,
      // Created as a draft (publishedAt null) — staff publish explicitly
      // via setVideoPublishedAction, same publish-workflow shape as news.
    },
  });

  revalidatePath('/admin/videos');
  redirect('/admin/videos');
}

export async function updateVideoAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.videoEntry.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      provider: parsed.data.provider,
      externalUrl: parsed.data.externalUrl || null,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      categoryId: parsed.data.categoryId || null,
      isFeatured: parsed.data.isFeatured ?? false,
    },
  });

  revalidatePath('/admin/videos');
  revalidatePath('/videos');
  return { success: true, data: undefined };
}

export async function setVideoPublishedAction(id: string, published: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  await prisma.videoEntry.update({ where: { id }, data: { publishedAt: published ? new Date() : null } });

  revalidatePath('/admin/videos');
  revalidatePath('/videos');
  return { success: true, data: undefined };
}

export async function deleteVideoAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MEDIA_MANAGER);

  try {
    await prisma.videoEntry.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this video.' };
  }

  revalidatePath('/admin/videos');
  revalidatePath('/videos');
  return { success: true, data: undefined };
}
