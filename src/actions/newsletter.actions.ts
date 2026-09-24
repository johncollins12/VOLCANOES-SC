'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { emailSchema } from '@/lib/validation/common';
import type { ActionResult } from '@/types';

/**
 * NOW PERSISTED (Admin CMS phase) — the NewsletterSubscriber model was
 * added to the schema specifically so this stopped being a stub (see the
 * model's comment in prisma/schema.prisma). Upserts on email so a visitor
 * who unsubscribed and signs up again is reactivated rather than
 * rejected on the unique constraint.
 */
export async function subscribeToNewsletterAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get('email'));

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted field.',
      fieldErrors: { email: parsed.error.flatten().formErrors },
    };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      update: { isActive: true, unsubscribedAt: null },
      create: { email: parsed.data },
    });
  } catch (error) {
    console.error('[subscribeToNewsletterAction] failed to save subscriber:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }

  return { success: true, data: undefined };
}

export async function unsubscribeFromAdminAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  await prisma.newsletterSubscriber.update({ where: { id }, data: { isActive: false, unsubscribedAt: new Date() } });

  revalidatePath('/admin/newsletter');
  return { success: true, data: undefined };
}

export async function deleteSubscriberAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this subscriber.' };
  }

  revalidatePath('/admin/newsletter');
  return { success: true, data: undefined };
}
