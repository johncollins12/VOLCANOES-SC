'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { emailSchema, phoneSchema } from '@/lib/validation/common';
import type { ActionResult } from '@/types';

const optionalUrl = z.string().trim().url('Enter a valid URL.').optional().or(z.literal(''));

const settingsSchema = z.object({
  foundedYear: z.string().trim().optional(),
  history: z.string().trim().optional(),
  vision: z.string().trim().optional(),
  mission: z.string().trim().optional(),
  motto: z.string().trim().optional(),
  crestUrl: z.string().trim().optional(),
  stadiumName: z.string().trim().optional(),
  stadiumAddress: z.string().trim().optional(),
  contactEmail: emailSchema.optional().or(z.literal('')),
  contactPhone: phoneSchema,
  contactAddress: z.string().trim().optional(),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  seoDefaultTitle: z.string().trim().max(70).optional(),
  seoDefaultDescription: z.string().trim().max(200).optional(),
  homepageHeroImageUrl: z.string().trim().optional(),
});

/**
 * Upserts the single ClubProfile row (there's exactly one — see
 * getClubProfile's comment). SUPER_ADMIN only: club identity/contact/SEO
 * defaults are club-wide settings, not a per-content-type editing
 * permission like CONTENT_EDITOR.
 */
export async function updateClubProfileAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;
  const foundedYear = d.foundedYear ? Number(d.foundedYear) : null;

  const data = {
    foundedYear: Number.isFinite(foundedYear) ? foundedYear : null,
    history: d.history || null,
    vision: d.vision || null,
    mission: d.mission || null,
    motto: d.motto || null,
    crestUrl: d.crestUrl || null,
    stadiumName: d.stadiumName || null,
    stadiumAddress: d.stadiumAddress || null,
    contactEmail: d.contactEmail || null,
    contactPhone: d.contactPhone || null,
    contactAddress: d.contactAddress || null,
    facebookUrl: d.facebookUrl || null,
    instagramUrl: d.instagramUrl || null,
    twitterUrl: d.twitterUrl || null,
    youtubeUrl: d.youtubeUrl || null,
    tiktokUrl: d.tiktokUrl || null,
    seoDefaultTitle: d.seoDefaultTitle || null,
    seoDefaultDescription: d.seoDefaultDescription || null,
    homepageHeroImageUrl: d.homepageHeroImageUrl || null,
  };

  const existing = await prisma.clubProfile.findFirst({ select: { id: true } });

  if (existing) {
    await prisma.clubProfile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.clubProfile.create({ data });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/contact');

  return { success: true, data: undefined };
}
