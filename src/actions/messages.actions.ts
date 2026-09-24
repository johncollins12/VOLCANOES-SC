'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import type { ActionResult } from '@/types';

export async function markMessageReadAction(id: string, isRead: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  await prisma.contactMessage.update({ where: { id }, data: { isRead } });

  revalidatePath('/admin/messages');
  revalidatePath(`/admin/messages/${id}`);
  revalidatePath('/admin'); // unread count shown on the dashboard
  return { success: true, data: undefined };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  try {
    await prisma.contactMessage.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this message.' };
  }

  revalidatePath('/admin/messages');
  revalidatePath('/admin');
  return { success: true, data: undefined };
}
