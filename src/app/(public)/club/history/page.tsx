import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { getClubProfile } from '@/lib/data/settings';
import { SITE_CONFIG } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Club History',
  description: `The history of ${SITE_CONFIG.name}.`,
  path: '/club/history',
});

/**
 * /club/history — sourced entirely from ClubProfile.history (see
 * src/lib/data/settings.ts). This was one of several routes linked from
 * the nav/footer since early phases that had no page behind them yet
 * (found during the Production Readiness audit) — fixed using the
 * ClubProfile model that already existed for exactly this purpose,
 * rather than inventing new data plumbing.
 */
export default async function ClubHistoryPage() {
  const profile = await getClubProfile();

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Club History</h1>
        {profile?.foundedYear && <p className="mb-6 text-sm text-muted">Founded {profile.foundedYear}</p>}

        {profile?.history ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink/90">{profile.history}</p>
        ) : (
          <p className="text-sm text-muted">
            The club&rsquo;s history will appear here once added from the admin dashboard.
          </p>
        )}
      </Container>
    </Section>
  );
}
