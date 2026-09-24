import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { getClubProfile } from '@/lib/data/settings';
import { SITE_CONFIG } from '@/config/site';
import { ContactForm } from './ContactForm';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact',
  description: `Get in touch with ${SITE_CONFIG.name}.`,
  path: '/contact',
});

export default async function ContactPage() {
  const profile = await getClubProfile();
  const email = profile?.contactEmail || SITE_CONFIG.contact.email;
  const phone = profile?.contactPhone || SITE_CONFIG.contact.phone;
  const address = profile?.contactAddress || SITE_CONFIG.contact.address;

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Contact</h1>
        <p className="mb-6 text-sm text-muted">Get in touch with the club.</p>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Get in Touch</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="font-medium text-ink">Email</dt>
                <dd className="text-muted">{email || '⚠️ Not yet provided'}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Phone</dt>
                <dd className="text-muted">{phone || '⚠️ Not yet provided'}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Address</dt>
                <dd className="text-muted">{address || '⚠️ Not yet provided'}</dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
