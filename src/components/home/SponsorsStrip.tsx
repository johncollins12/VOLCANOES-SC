import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import type { SponsorSummary } from '@/lib/data/sponsors';

/**
 * Homepage sponsors strip. Renders nothing (not an empty state — sponsors
 * are a "nice to have" row, not core content a visitor is looking for) if
 * no active sponsors exist yet, so the homepage doesn't show an awkward
 * "no sponsors" message to the public.
 */
export function SponsorsStrip({ sponsors }: { sponsors: SponsorSummary[] }) {
  if (sponsors.length === 0) return null;

  return (
    <div className="border-y border-border bg-surface py-8">
      <Container>
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wide text-muted">
          Our Sponsors &amp; Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {sponsors.map((sponsor) =>
            sponsor.logoUrl ? (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl ?? undefined}
                target={sponsor.websiteUrl ? '_blank' : undefined}
                rel={sponsor.websiteUrl ? 'noopener noreferrer' : undefined}
                className="relative h-10 w-28 grayscale transition-all hover:grayscale-0"
              >
                <Image src={sponsor.logoUrl} alt={sponsor.name} fill className="object-contain" sizes="112px" />
              </a>
            ) : (
              <span key={sponsor.id} className="text-sm font-medium text-muted">
                {sponsor.name}
              </span>
            )
          )}
        </div>
      </Container>
    </div>
  );
}
