'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { nonEmptyString } from '@/lib/validation/common';
import { sanitizeRichText } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

const reportSchema = z.object({
  title: nonEmptyString('Title'),
  body: nonEmptyString('Body'),
  coverImageUrl: z.string().trim().optional(),
  possessionHome: z.string().trim().optional(),
  possessionAway: z.string().trim().optional(),
  shotsHome: z.string().trim().optional(),
  shotsAway: z.string().trim().optional(),
  shotsOnTargetHome: z.string().trim().optional(),
  shotsOnTargetAway: z.string().trim().optional(),
  cornersHome: z.string().trim().optional(),
  cornersAway: z.string().trim().optional(),
  foulsHome: z.string().trim().optional(),
  foulsAway: z.string().trim().optional(),
});

function toStat(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Creates or updates both the MatchReport and its MatchStatistics row for
 * a fixture in one submit — the admin form (MatchReportForm) presents them
 * as a single screen, so one action handles both upserts rather than
 * requiring two separate saves for what staff experience as one report.
 * `publishedAt` is left untouched here; see setMatchReportPublishedAction
 * for the explicit publish/unpublish toggle.
 */
export async function saveMatchReportAction(
  fixtureId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MATCHDAY_EDITOR, ROLES.CONTENT_EDITOR);

  const parsed = reportSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    coverImageUrl: formData.get('coverImageUrl') || undefined,
    possessionHome: formData.get('possessionHome') || undefined,
    possessionAway: formData.get('possessionAway') || undefined,
    shotsHome: formData.get('shotsHome') || undefined,
    shotsAway: formData.get('shotsAway') || undefined,
    shotsOnTargetHome: formData.get('shotsOnTargetHome') || undefined,
    shotsOnTargetAway: formData.get('shotsOnTargetAway') || undefined,
    cornersHome: formData.get('cornersHome') || undefined,
    cornersAway: formData.get('cornersAway') || undefined,
    foulsHome: formData.get('foulsHome') || undefined,
    foulsAway: formData.get('foulsAway') || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.matchReport.upsert({
    where: { fixtureId },
    create: {
      fixtureId,
      title: parsed.data.title,
      body: sanitizeRichText(parsed.data.body),
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      authorId: user.id,
    },
    update: {
      title: parsed.data.title,
      body: sanitizeRichText(parsed.data.body),
      coverImageUrl: parsed.data.coverImageUrl ?? null,
    },
  });

  const statsValues = {
    possessionHome: toStat(parsed.data.possessionHome),
    possessionAway: toStat(parsed.data.possessionAway),
    shotsHome: toStat(parsed.data.shotsHome),
    shotsAway: toStat(parsed.data.shotsAway),
    shotsOnTargetHome: toStat(parsed.data.shotsOnTargetHome),
    shotsOnTargetAway: toStat(parsed.data.shotsOnTargetAway),
    cornersHome: toStat(parsed.data.cornersHome),
    cornersAway: toStat(parsed.data.cornersAway),
    foulsHome: toStat(parsed.data.foulsHome),
    foulsAway: toStat(parsed.data.foulsAway),
  };
  const hasAnyStat = Object.values(statsValues).some((v) => v !== null);

  if (hasAnyStat) {
    await prisma.matchStatistics.upsert({
      where: { fixtureId },
      create: { fixtureId, ...statsValues },
      update: statsValues,
    });
  }

  revalidatePath('/admin/fixtures');
  revalidatePath(`/admin/match-reports/${fixtureId}/edit`);
  revalidatePath(`/match-reports/${fixtureId}`);
  revalidatePath('/match-reports');
  return { success: true, data: undefined };
}

export async function setMatchReportPublishedAction(fixtureId: string, publish: boolean): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MATCHDAY_EDITOR, ROLES.CONTENT_EDITOR);

  try {
    await prisma.matchReport.update({
      where: { fixtureId },
      data: { publishedAt: publish ? new Date() : null },
    });
  } catch {
    return { success: false, error: 'Save the report before publishing it.' };
  }

  revalidatePath(`/admin/match-reports/${fixtureId}/edit`);
  revalidatePath(`/match-reports/${fixtureId}`);
  revalidatePath('/match-reports');
  return { success: true, data: undefined };
}
