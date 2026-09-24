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

const FIXTURE_STATUSES = ['SCHEDULED', 'LIVE', 'FULL_TIME', 'POSTPONED', 'CANCELLED'] as const;

const fixtureSchema = z.object({
  seasonId: nonEmptyString('Season'),
  competitionId: nonEmptyString('Competition'),
  venueId: z.string().trim().optional(),
  homeTeamName: nonEmptyString('Home team'),
  awayTeamName: nonEmptyString('Away team'),
  isHome: z.coerce.boolean(),
  kickoffAt: z.string().trim().min(1, 'Kickoff date/time is required.'),
  status: z.enum(FIXTURE_STATUSES),
  homeScore: z.string().trim().optional(),
  awayScore: z.string().trim().optional(),
  ticketingEnabled: z.coerce.boolean(),
});

function parseFixtureForm(formData: FormData) {
  return fixtureSchema.safeParse({
    seasonId: formData.get('seasonId'),
    competitionId: formData.get('competitionId'),
    venueId: formData.get('venueId') || undefined,
    homeTeamName: formData.get('homeTeamName'),
    awayTeamName: formData.get('awayTeamName'),
    isHome: formData.get('isHome') === 'on',
    kickoffAt: formData.get('kickoffAt'),
    status: formData.get('status'),
    homeScore: formData.get('homeScore') || undefined,
    awayScore: formData.get('awayScore') || undefined,
    ticketingEnabled: formData.get('ticketingEnabled') === 'on',
  });
}

/** Empty-string score fields mean "not recorded" (null), not "0-0" — a fixture that hasn't been played shouldn't default to a scoreline. */
function toScore(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createFixtureAction(_prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MATCHDAY_EDITOR);

  const parsed = parseFixtureForm(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const fixture = await prisma.fixture.create({
    data: {
      seasonId: parsed.data.seasonId,
      competitionId: parsed.data.competitionId,
      venueId: parsed.data.venueId || null,
      homeTeamName: parsed.data.homeTeamName,
      awayTeamName: parsed.data.awayTeamName,
      isHome: parsed.data.isHome,
      kickoffAt: new Date(parsed.data.kickoffAt),
      status: parsed.data.status,
      homeScore: toScore(parsed.data.homeScore),
      awayScore: toScore(parsed.data.awayScore),
      ticketingEnabled: parsed.data.ticketingEnabled,
    },
  });

  revalidatePath('/admin/fixtures');
  revalidatePath('/fixtures');
  revalidatePath('/results');
  redirect(`/admin/fixtures/${fixture.id}/edit`);
}

export async function updateFixtureAction(id: string, _prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MATCHDAY_EDITOR);

  const parsed = parseFixtureForm(formData);
  if (!parsed.success) {
    return { success: false, error: 'Please check the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.fixture.update({
    where: { id },
    data: {
      seasonId: parsed.data.seasonId,
      competitionId: parsed.data.competitionId,
      venueId: parsed.data.venueId || null,
      homeTeamName: parsed.data.homeTeamName,
      awayTeamName: parsed.data.awayTeamName,
      isHome: parsed.data.isHome,
      kickoffAt: new Date(parsed.data.kickoffAt),
      status: parsed.data.status,
      homeScore: toScore(parsed.data.homeScore),
      awayScore: toScore(parsed.data.awayScore),
      ticketingEnabled: parsed.data.ticketingEnabled,
    },
  });

  revalidatePath('/admin/fixtures');
  revalidatePath('/fixtures');
  revalidatePath('/results');
  revalidatePath('/');
  return { success: true, data: undefined };
}

export async function deleteFixtureAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  requireRole(user, ROLES.MATCHDAY_EDITOR);

  try {
    await prisma.fixture.delete({ where: { id } });
  } catch {
    return { success: false, error: 'Could not delete this fixture. It may have a linked match report or statistics.' };
  }

  revalidatePath('/admin/fixtures');
  revalidatePath('/fixtures');
  revalidatePath('/results');
  return { success: true, data: undefined };
}
