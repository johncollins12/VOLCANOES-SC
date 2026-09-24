import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface StaffCardProps {
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  className?: string;
}

/**
 * Management/technical staff listing card — used on /club/management and
 * /club/technical-staff. Deliberately simpler than PlayerCard (no jersey
 * number, no nationality row): a club chairman or physiotherapist doesn't
 * have those attributes, so this stays its own component rather than
 * PlayerCard with optional fields quietly meaning different things.
 */
export function StaffCard({ name, role, bio, photoUrl, className }: StaffCardProps) {
  return (
    <div className={cn('overflow-hidden rounded-card border border-border bg-surface shadow-card', className)}>
      <div className="relative aspect-square bg-charcoal">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-14 w-14" fill="currentColor">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-base font-semibold text-ink">{name}</p>
        <p className="text-sm text-accent">{role}</p>
        {bio && <p className="mt-2 line-clamp-3 text-sm text-muted">{bio}</p>}
      </div>
    </div>
  );
}
