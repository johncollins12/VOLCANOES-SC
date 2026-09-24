'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { nonEmptyString } from '@/lib/validation/common';
import { slugify } from '@/lib/utils';
import { sanitizeRichText } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

const articleSchema = z.object({
  title: nonEmptyString('Title'),
  excerpt: z.string().trim().max(300).optional(),
  body: nonEmptyString('Body'),
  coverImageUrl: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
});

/** Ensures a unique slug by appending -2, -3, etc. on collision (e.g. two articles both titled "Match Preview"). */
async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let counter = 2;
  while (
    await prisma.newsArticle.findFirst({ where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) } })
  ) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}

export async function createNewsArticleAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt') || undefined,
    body: formData.get('body'),
    coverImageUrl: formData.get('coverImageUrl') || undefined,
    categoryId: formData.get('categoryId') || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slug = await generateUniqueSlug(parsed.data.title);

  const article = await prisma.newsArticle.create({
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt ?? null,
      body: sanitizeRichText(parsed.data.body),
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      categoryId: parsed.data.categoryId ?? null,
      authorId: user.id,
      status: 'DRAFT',
    },
  });

  revalidatePath('/admin/news');
  redirect(`/admin/news/${article.id}/edit`);
}

export async function updateNewsArticleAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt') || undefined,
    body: formData.get('body'),
    coverImageUrl: formData.get('coverImageUrl') || undefined,
    categoryId: formData.get('categoryId') || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.newsArticle.findUnique({ where: { id }, select: { title: true, slug: true } });
  if (!existing) return { success: false, error: 'Article not found.' };

  const slug = existing.title === parsed.data.title ? existing.slug : await generateUniqueSlug(parsed.data.title, id);

  await prisma.newsArticle.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt ?? null,
      body: sanitizeRichText(parsed.data.body),
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      categoryId: parsed.data.categoryId ?? null,
    },
  });

  revalidatePath('/admin/news');
  revalidatePath(`/news/${slug}`);
  return { success: true, data: undefined };
}

export async function setNewsArticleStatusAction(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const article = await prisma.newsArticle.update({
    where: { id },
    data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : undefined },
    select: { slug: true },
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath(`/news/${article.slug}`);
  return { success: true, data: undefined };
}

export async function deleteNewsArticleAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  try {
    await prisma.newsArticle.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this article.' };
  }

  revalidatePath('/admin/news');
  revalidatePath('/news');
  return { success: true, data: undefined };
}
