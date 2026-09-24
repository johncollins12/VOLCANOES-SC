import Link from 'next/link';
import { FOOTER_NAV } from '@/config/navigation';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { LogoMark } from './LogoMark';
import { getClubProfile } from '@/lib/data/settings';

const SOCIAL_PLATFORM_LABELS = {
  facebookUrl: 'Facebook',
  instagramUrl: 'Instagram',
  twitterUrl: 'X / Twitter',
  youtubeUrl: 'YouTube',
  tiktokUrl: 'TikTok',
} as const;

/**
 * Server Component (async) so it can read the ClubProfile row saved from
 * /admin/settings — contact details and social links used to be a
 * hardcoded empty array/placeholder strings (SITE_CONFIG), now they're
 * real DB fields with SITE_CONFIG as the fallback until a SUPER_ADMIN
 * saves Settings for the first time (see getClubProfile's comment).
 */
export async function Footer() {
  const profile = await getClubProfile();
  const year = new Date().getFullYear();

  const contactAddress = profile?.contactAddress || SITE_CONFIG.contact.address;
  const contactPhone = profile?.contactPhone || SITE_CONFIG.contact.phone;
  const contactEmail = profile?.contactEmail || SITE_CONFIG.contact.email;

  const socialLinks = profile
    ? (Object.keys(SOCIAL_PLATFORM_LABELS) as (keyof typeof SOCIAL_PLATFORM_LABELS)[])
        .filter((key) => profile[key])
        .map((key) => ({ platform: SOCIAL_PLATFORM_LABELS[key], url: profile[key] as string }))
    : [];

  return (
    <footer className="border-t border-border bg-charcoal text-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-display text-lg">
            <LogoMark />
            {SITE_CONFIG.shortName}
          </div>
          <p className="text-sm text-white/70">
            {profile?.motto || SITE_CONFIG.tagline || 'Official club description coming soon.'}
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-display text-sm uppercase tracking-wide text-accent">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {FOOTER_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display text-sm uppercase tracking-wide text-accent">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li>{contactAddress || '⚠️ Address pending club input'}</li>
            <li>{contactPhone || '⚠️ Phone pending club input'}</li>
            <li>{contactEmail || '⚠️ Email pending club input'}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display text-sm uppercase tracking-wide text-accent">Follow Us</h3>
          {socialLinks.length === 0 ? (
            <p className="text-sm text-white/60">⚠️ Social links pending club input</p>
          ) : (
            <ul className="flex gap-3">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="border-t border-border/20 py-4">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {SITE_CONFIG.legalName}. All rights reserved.
          </p>
          <Link href="/admin" className="hover:text-white">
            Staff Login
          </Link>
        </Container>
      </div>
    </footer>
  );
}
