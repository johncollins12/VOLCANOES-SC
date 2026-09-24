import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export interface ClubProfileData {
  foundedYear: number | null;
  history: string | null;
  vision: string | null;
  mission: string | null;
  motto: string | null;
  crestUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  stadiumName: string | null;
  stadiumAddress: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  homepageHeroImageUrl: string | null;
}

/**
 * There is exactly one ClubProfile row (a settings singleton, not a list)
 * — created lazily on first admin save rather than in the seed script
 * (see prisma/seed.ts's comment on why club facts are never seeded).
 * Wrapped in React's cache() since both the public site (Footer, Hero) and
 * the admin Settings page read this in the same request tree.
 *
 * Returns `null` — not a fabricated default profile — until a
 * SUPER_ADMIN saves Settings for the first time. Every public call site
 * falls back to the static src/config/site.ts constants when this is
 * null, so the site never breaks before that first save.
 */
export const getClubProfile = cache(async (): Promise<ClubProfileData | null> => {
  try {
    return await prisma.clubProfile.findFirst();
  } catch (error) {
    console.error('[getClubProfile] failed to load club profile:', error);
    return null;
  }
});
