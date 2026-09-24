import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { SponsorCard } from '@/components/football/SponsorCard';
import { getActiveSponsors } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Sponsors',
  description: 'Volcanoes FC sponsors and partners.',
  path: '/sponsors',
});

/**
 * /sponsors — another route linked from the footer since early phases
 * with no page behind it (found during the Production Readiness audit).
 * Reuses getActiveSponsors and SponsorCard exactly as built in Phase 2/6
 * — no new data plumbing needed, this page just didn't exist yet.
 */
export default async function SponsorsPage() {
  const sponsors = await getActiveSponsors();

  return (
    <Section>
      <Container>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Sponsors</h1>
        <p className="mb-6 text-sm text-muted">The partners supporting Volcanoes FC.</p>

        {sponsors.length === 0 ? (
          <EmptyState title="No sponsors yet" description="Sponsor logos will appear here once added from the admin dashboard." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((s) => (
              <SponsorCard key={s.id} name={s.name} logoUrl={s.logoUrl} websiteUrl={s.websiteUrl} tierName={s.tierName} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
