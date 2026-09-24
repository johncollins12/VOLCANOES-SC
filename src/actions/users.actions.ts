'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { emailSchema, nonEmptyString } from '@/lib/validation/common';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/types';

const createUserSchema = z.object({
  fullName: nonEmptyString('Full name'),
  email: emailSchema,
  roleIds: z.array(z.string()).min(1, 'Select at least one role.'),
});

/**
 * Creates a staff account: a Supabase Auth user (via the service-role
 * admin API — the only way to create a user server-side without them
 * self-registering) AND the corresponding Prisma User row + role
 * assignments, since User.id is defined to mirror auth.users.id (see the
 * schema comment on User.id).
 *
 * Sends a Supabase invite email rather than setting a password directly —
 * consistent with "no public self-registration" (architecture §5): the
 * account exists but is inert until the invited staff member sets their
 * own password via the emailed link.
 *
 * If the Prisma insert fails after the auth user was already created,
 * the auth user is rolled back (deleted) so a failed "create user" never
 * leaves an orphaned Supabase Auth account with no corresponding app
 * User row — a form retry with the same email would otherwise get a
 * confusing "already exists" error with no visible reason why.
 */
export async function createUserAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const currentUser = await requireUser();
  requireRole(currentUser, ROLES.SUPER_ADMIN);

  const parsed = createUserSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    roleIds: formData.getAll('roleIds'),
  });

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabaseAdmin = createSupabaseServiceRoleClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(parsed.data.email);

  if (authError || !authData.user) {
    return { success: false, error: authError?.message ?? 'Could not create the account.' };
  }

  try {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: parsed.data.email,
        fullName: parsed.data.fullName,
        roles: { create: parsed.data.roleIds.map((roleId) => ({ roleId })) },
      },
    });
  } catch (error) {
    console.error('[createUserAction] Prisma insert failed after auth user creation, rolling back:', error);
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: 'Could not save the staff record. Please try again.' };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

const updateUserSchema = z.object({
  fullName: nonEmptyString('Full name'),
  roleIds: z.array(z.string()).min(1, 'Select at least one role.'),
});

export async function updateUserRolesAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const currentUser = await requireUser();
  requireRole(currentUser, ROLES.SUPER_ADMIN);

  const parsed = updateUserSchema.safeParse({
    fullName: formData.get('fullName'),
    roleIds: formData.getAll('roleIds'),
  });

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { fullName: parsed.data.fullName } }),
    prisma.userRole.deleteMany({ where: { userId: id } }),
    prisma.userRole.createMany({ data: parsed.data.roleIds.map((roleId) => ({ userId: id, roleId })) }),
  ]);

  revalidatePath('/admin/users');
  return { success: true, data: undefined };
}

export async function toggleUserActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
  const currentUser = await requireUser();
  requireRole(currentUser, ROLES.SUPER_ADMIN);

  if (id === currentUser.id && !isActive) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  await prisma.user.update({ where: { id }, data: { isActive } });

  revalidatePath('/admin/users');
  return { success: true, data: undefined };
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const currentUser = await requireUser();
  requireRole(currentUser, ROLES.SUPER_ADMIN);

  if (id === currentUser.id) {
    return { success: false, error: 'You cannot delete your own account.' };
  }

  try {
    await prisma.user.delete({ where: { id } });
    const supabaseAdmin = createSupabaseServiceRoleClient();
    await supabaseAdmin.auth.admin.deleteUser(id);
  } catch (error) {
    console.error('[deleteUserAction] failed:', error);
    return { success: false, error: 'Could not delete this user.' };
  }

  revalidatePath('/admin/users');
  return { success: true, data: undefined };
}
