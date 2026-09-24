import { prisma } from '@/lib/prisma';

export interface CompetitionOption {
  id: string;
  name: string;
}

/**
 * All competitions, for the Fixtures/Results/League Table filter dropdowns.
 * Returns an empty array — never fabricated competition names — if none
 * have been entered yet, or if the query fails.
 */
export async function getCompetitions(): Promise<CompetitionOption[]> {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    return competitions;
  } catch (error) {
    console.error('[getCompetitions] failed to load competitions:', error);
    return [];
  }
}
