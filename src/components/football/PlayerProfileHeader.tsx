import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { formatDisplayDate } from '@/lib/utils';

export interface PlayerProfileHeaderProps {
  name: string;
  jerseyNumber: number | null;
  position: string | null;
  nationality: string | null;
  dateOfBirth: Date | null;
  heightCm: number | null;
  joinedDate: Date | null;
  photoUrl: string | null;
}

/**
 * The player profile page's header: photo, name, and the bio-data grid
 * (jersey number, position, nationality, DOB, height, joined date).
 * Distinct from both PlayerCard (compact squad-grid teaser, no bio data)
 * and PlayerStatCard (a stats row, no photo/bio data) — neither of those
 * covers this layout, so this is new rather than a near-duplicate.
 *
 * Every field renders "—" rather than being omitted when null, so the
 * grid's shape stays consistent regardless of how much data has been
 * entered for a given player yet.
 */
export function PlayerProfileHeader({
  name,
  jerseyNumber,
  position,
  nationality,
  dateOfBirth,
  heightCm,
  joinedDate,
  photoUrl,
}: PlayerProfileHeaderProps) {
  const age = dateOfBirth
    ? Math.floor((Date.now() - dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="relative aspect-[3/4] w-full max-w-[240px] shrink-0 overflow-hidden rounded-card bg-charcoal">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="240px" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-20 w-20" fill="currentColor">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z" />
            </svg>
          </div>
        )}
        {jerseyNumber != null && (
          <span className="absolute right-3 top-3 rounded-card bg-charcoal/90 px-2.5 py-1 font-mono text-2xl font-semibold text-white">
            {jerseyNumber}
          </span>
        )}
      </div>

      <div className="flex-1">
        {position && <Badge>{position}</Badge>}
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{name}</h1>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Field label="Nationality" value={nationality} />
          <Field
            label="Date of Birth"
            value={dateOfBirth ? `${formatDisplayDate(dateOfBirth)}${age !== null ? ` (${age})` : ''}` : null}
          />
          <Field label="Height" value={heightCm ? `${heightCm} cm` : null} />
          <Field label="Joined" value={joinedDate ? formatDisplayDate(joinedDate) : null} />
        </dl>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value ?? '—'}</dd>
    </div>
  );
}
