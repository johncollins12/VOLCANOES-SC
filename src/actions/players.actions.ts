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
import { getCurrentSeason } from '@/lib/data/season';
import type { ActionResult } from '@/types';

const playerSchema = z.object({
  fullName: nonEmptyString('Full name'),
  jerseyNumber: z.coerce.number().int().min(0).max(99).optional(),
  positionId: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  dateOfBirth: z.string().trim().optional(),
  heightCm: z.coerce.number().int().min(100).max(250).optional(),
  joinedDate: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
});

/** Same collision-avoidance approach as news articles (see generateUniqueSlug in news.actions.ts) — kept as its own copy rather than a shared generic helper, since the two act on different Prisma models with no natural common interface to genericize over without adding complexity that isn't earning its keep for two call sites. */
async function generateUniquePlayerSlug(fullName: string, excludeId?: string): Promise<string> {
  const base = slugify(fullName);
  let candidate = base;
  let counter = 2;
  while (
    await prisma.player.findFirst({ where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) } })
  ) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}

function parseFormData(formData: FormData) {
  return playerSchema.safeParse({
    fullName: formData.get('fullName'),
    jerseyNumber: formData.get('jerseyNumber') || undefined,
    positionId: formData.get('positionId') || undefined,
    nationality: formData.get('nationality') || undefined,
    dateOfBirth: formData.get('dateOfBirth') || undefined,
    heightCm: formData.get('heightCm') || undefined,
    joinedDate: formData.get('joinedDate') || undefined,
    bio: formData.get('bio') || undefined,
    photoUrl: formData.get('photoUrl') || undefined,
  });
}

export async function createPlayerAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slug = await generateUniquePlayerSlug(parsed.data.fullName);

  const player = await prisma.player.create({
    data: {
      fullName: parsed.data.fullName,
      slug,
      jerseyNumber: parsed.data.jerseyNumber ?? null,
      positionId: parsed.data.positionId || null,
      nationality: parsed.data.nationality || null,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
      heightCm: parsed.data.heightCm ?? null,
      joinedDate: parsed.data.joinedDate ? new Date(parsed.data.joinedDate) : null,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
    },
  });

  revalidatePath('/admin/players');
  redirect(`/admin/players/${player.id}/edit`);
}

const statsSchema = z.object({
  appearances: z.coerce.number().int().min(0).optional(),
  goals: z.coerce.number().int().min(0).optional(),
  assists: z.coerce.number().int().min(0).optional(),
  yellowCards: z.coerce.number().int().min(0).optional(),
  redCards: z.coerce.number().int().min(0).optional(),
  minutesPlayed: z.coerce.number().int().min(0).optional(),
  cleanSheets: z.coerce.number().int().min(0).optional(),
  saves: z.coerce.number().int().min(0).optional(),
  savePercentage: z.coerce.number().min(0).max(100).optional(),
  penaltiesSaved: z.coerce.number().int().min(0).optional(),
  goalsConceded: z.coerce.number().int().min(0).optional(),
});

export async function updatePlayerAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.player.findUnique({ where: { id }, select: { fullName: true, slug: true } });
  if (!existing) return { success: false, error: 'Player not found.' };

  const slug = existing.fullName === parsed.data.fullName ? existing.slug : await generateUniquePlayerSlug(parsed.data.fullName, id);

  await prisma.player.update({
    where: { id },
    data: {
      fullName: parsed.data.fullName,
      slug,
      jerseyNumber: parsed.data.jerseyNumber ?? null,
      positionId: parsed.data.positionId || null,
      nationality: parsed.data.nationality || null,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
      heightCm: parsed.data.heightCm ?? null,
      joinedDate: parsed.data.joinedDate ? new Date(parsed.data.joinedDate) : null,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
    },
  });

  // Season stats (including the goalkeeper-specific fields) are optional
  // and upserted separately from the player's bio-data — a player with no
  // stats entered yet shouldn't get a phantom all-zero PlayerStat row.
  const statsParsed = statsSchema.safeParse({
    appearances: formData.get('appearances') || undefined,
    goals: formData.get('goals') || undefined,
    assists: formData.get('assists') || undefined,
    yellowCards: formData.get('yellowCards') || undefined,
    redCards: formData.get('redCards') || undefined,
    minutesPlayed: formData.get('minutesPlayed') || undefined,
    cleanSheets: formData.get('cleanSheets') || undefined,
    saves: formData.get('saves') || undefined,
    savePercentage: formData.get('savePercentage') || undefined,
    penaltiesSaved: formData.get('penaltiesSaved') || undefined,
    goalsConceded: formData.get('goalsConceded') || undefined,
  });

  if (statsParsed.success && Object.values(statsParsed.data).some((v) => v !== undefined)) {
    const currentSeason = await getCurrentSeason();
    if (currentSeason) {
      const existingStat = await prisma.playerStat.findFirst({ where: { playerId: id, seasonId: currentSeason.id } });
      const data = {
        appearances: statsParsed.data.appearances ?? 0,
        goals: statsParsed.data.goals ?? 0,
        assists: statsParsed.data.assists ?? 0,
        yellowCards: statsParsed.data.yellowCards ?? 0,
        redCards: statsParsed.data.redCards ?? 0,
        minutesPlayed: statsParsed.data.minutesPlayed ?? 0,
        cleanSheets: statsParsed.data.cleanSheets ?? null,
        saves: statsParsed.data.saves ?? null,
        savePercentage: statsParsed.data.savePercentage ?? null,
        penaltiesSaved: statsParsed.data.penaltiesSaved ?? null,
        goalsConceded: statsParsed.data.goalsConceded ?? null,
      };
      if (existingStat) {
        await prisma.playerStat.update({ where: { id: existingStat.id }, data });
      } else {
        await prisma.playerStat.create({ data: { playerId: id, seasonId: currentSeason.id, ...data } });
      }
    }
  }

  revalidatePath('/admin/players');
  revalidatePath('/team');
  revalidatePath(`/team/${slug}`);
  return { success: true, data: undefined };
}

export async function togglePlayerActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  await prisma.player.update({ where: { id }, data: { isActive } });

  revalidatePath('/admin/players');
  revalidatePath('/team');
  return { success: true, data: undefined };
}

export async function deletePlayerAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.CONTENT_EDITOR);

  try {
    await prisma.player.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this player.' };
  }

  revalidatePath('/admin/players');
  revalidatePath('/team');
  return { success: true, data: undefined };
}
