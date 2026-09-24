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

const sponsorSchema = z.object({
  name: nonEmptyString('Name'),
  logoUrl: z.string().trim().optional(),
  websiteUrl: z.string().trim().url('Enter a valid URL.').optional().or(z.literal('')),
  tierId: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

function parseFormData(formData: FormData) {
  return sponsorSchema.safeParse({
    name: formData.get('name'),
    logoUrl: formData.get('logoUrl') || undefined,
    websiteUrl: formData.get('websiteUrl') || undefined,
    tierId: formData.get('tierId') || undefined,
    displayOrder: formData.get('displayOrder') || undefined,
  });
}

export async function createSponsorAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.sponsor.create({
    data: {
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl || null,
      websiteUrl: parsed.data.websiteUrl || null,
      tierId: parsed.data.tierId || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  redirect('/admin/sponsors');
}

export async function updateSponsorAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.sponsor.update({
    where: { id },
    data: {
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl || null,
      websiteUrl: parsed.data.websiteUrl || null,
      tierId: parsed.data.tierId || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });

  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  return { success: true, data: undefined };
}

export async function toggleSponsorActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  await prisma.sponsor.update({ where: { id }, data: { isActive } });

  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  return { success: true, data: undefined };
}

export async function deleteSponsorAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  try {
    await prisma.sponsor.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this sponsor.' };
  }

  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  return { success: true, data: undefined };
}
