import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface PlayerCardProps {
  name: string;
  jerseyNumber?: number | null;
  position?: string | null;
  nationality?: string | null;
  photoUrl?: string | null;
  href?: string;
  className?: string;
}

/**
 * Squad grid card. Used on /team and anywhere a compact player reference
 * is needed (e.g. "player of the match" on a match report). Full profile
 * detail lives on the player's own page — this is the index/teaser view.
 *
 * Photo defaults to a silhouette placeholder — never fabricate a player
 * photo. Real photos arrive per docs/CLUB_INFO_NEEDED.md.
 */
export function PlayerCard({
  name,
  jerseyNumber,
  position,
  nationality,
  photoUrl,
  href,
  className,
}: PlayerCardProps) {
  const cardClassName = cn(
    'hover-lift group block overflow-hidden rounded-card border border-border bg-surface shadow-card',
    className
  );

  const content = (
    <>
      <div className="relative aspect-[3/4] bg-charcoal">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-16 w-16" fill="currentColor">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z" />
            </svg>
          </div>
        )}
        {jerseyNumber != null && (
          <span className="absolute right-2 top-2 rounded-card bg-charcoal/90 px-2 py-0.5 font-mono text-lg font-semibold text-white">
            {jerseyNumber}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-display text-base font-semibold text-ink">{name}</p>
        <p className="text-xs text-muted">
          {[position, nationality].filter(Boolean).join(' · ') || 'Position / nationality pending'}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
