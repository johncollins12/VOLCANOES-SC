import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface SponsorCardProps {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  tierName?: string | null;
  className?: string;
}

/**
 * Sponsor tile for the /sponsors page grid — larger and more detailed
 * (tier label, bordered card) than the homepage's SponsorsStrip, which
 * deliberately keeps sponsors small/secondary on that page. This is the
 * page where sponsors are the main content, so they get proper billing.
 */
export function SponsorCard({ name, logoUrl, websiteUrl, tierName, className }: SponsorCardProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-6 text-center shadow-card',
        websiteUrl && 'hover-lift',
        className
      )}
    >
      {tierName && <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{tierName}</span>}
      <div className="relative h-16 w-full">
        {logoUrl ? (
          <Image src={logoUrl} alt={name} fill className="object-contain" sizes="200px" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-muted">{name}</div>
        )}
      </div>
      {logoUrl && <p className="text-sm font-medium text-ink">{name}</p>}
    </div>
  );

  if (websiteUrl) {
    return (
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
