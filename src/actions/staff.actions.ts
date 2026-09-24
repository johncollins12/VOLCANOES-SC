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

const staffSchema = z.object({
  fullName: nonEmptyString('Full name'),
  role: nonEmptyString('Role/title'),
  categoryId: nonEmptyString('Category'),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

function parseFormData(formData: FormData) {
  return staffSchema.safeParse({
    fullName: formData.get('fullName'),
    role: formData.get('role'),
    categoryId: formData.get('categoryId'),
    bio: formData.get('bio') || undefined,
    photoUrl: formData.get('photoUrl') || undefined,
    displayOrder: formData.get('displayOrder') || undefined,
  });
}

export async function createStaffMemberAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.staffMember.create({
    data: {
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      categoryId: parsed.data.categoryId,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/staff');
  redirect('/admin/staff');
}

export async function updateStaffMemberAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.staffMember.update({
    where: { id },
    data: {
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      categoryId: parsed.data.categoryId,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/staff');
  return { success: true, data: undefined };
}

export async function toggleStaffActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  await prisma.staffMember.update({ where: { id }, data: { isActive } });

  revalidatePath('/admin/staff');
  return { success: true, data: undefined };
}

export async function deleteStaffMemberAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  try {
    await prisma.staffMember.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this staff member.' };
  }

  revalidatePath('/admin/staff');
  return { success: true, data: undefined };
}
