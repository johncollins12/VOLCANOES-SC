import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { getClubProfile } from '@/lib/data/settings';
import { SITE_CONFIG } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Vision & Mission',
  description: `${SITE_CONFIG.name}'s vision and mission.`,
  path: '/club/vision-mission',
});

export default async function VisionMissionPage() {
  const profile = await getClubProfile();
  const hasContent = profile?.vision || profile?.mission;

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Vision &amp; Mission</h1>

        {!hasContent ? (
          <p className="text-sm text-muted">This content will appear here once added from the admin dashboard.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {profile?.vision && (
              <div>
                <h2 className="mb-2 font-display text-xl font-semibold text-accent">Our Vision</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink/90">{profile.vision}</p>
              </div>
            )}
            {profile?.mission && (
              <div>
                <h2 className="mb-2 font-display text-xl font-semibold text-accent">Our Mission</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink/90">{profile.mission}</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
