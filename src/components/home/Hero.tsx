import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';
import { LogoMark } from '@/components/layout/LogoMark';
import { SITE_CONFIG } from '@/config/site';

export interface HeroProps {
  /** Real hero photo, once the club supplies one (docs/CLUB_INFO_NEEDED.md §7.1). Falls back to a plain gradient — never a fabricated stock photo. */
  backgroundImageUrl?: string | null;
  /** Overrides SITE_CONFIG.tagline once a SUPER_ADMIN saves one in /admin/settings. */
  motto?: string | null;
  /** Overrides SITE_CONFIG.foundedYear once saved in /admin/settings. */
  foundedYear?: number | null;
}

/**
 * Full-width homepage hero. Pulls copy from SITE_CONFIG (src/config/site.ts)
 * by default, but the page can now pass real ClubProfile-backed values
 * (see src/lib/data/settings.ts) once a SUPER_ADMIN has saved them —
 * this component's JSX didn't need to change, only where the values come
 * from, exactly as originally planned in this comment.
 */
export function Hero({ backgroundImageUrl, motto, foundedYear }: HeroProps) {
  const resolvedMotto = motto || SITE_CONFIG.tagline;
  const resolvedFoundedYear = foundedYear ?? SITE_CONFIG.foundedYear;

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      {/* Background image placeholder layer — swaps to a real <Image> once
          the club provides hero photography; a plain gradient + subtle
          stripe pattern stands in for it so the section still looks
          intentional, not broken, in the meantime. */}
      {backgroundImageUrl ? (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_40px)]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/85 to-charcoal" aria-hidden />

      <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <LogoMark className="h-16 w-16 sm:h-20 sm:w-20" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {resolvedFoundedYear && (
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70">
              Est. {resolvedFoundedYear}
            </span>
          )}
          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
            {SITE_CONFIG.competitionName}
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">{SITE_CONFIG.name}</h1>

        {/* Motto placeholder — falls back to this generic line until a
            motto exists in either ClubProfile or SITE_CONFIG. */}
        <p className="max-w-xl text-base text-white/70 sm:text-lg">
          {resolvedMotto || 'Club motto coming soon.'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/news" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
            Latest News
          </Link>
          <Link
            href="/fixtures"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'border-white/30 text-white hover:bg-white/10',
            })}
          >
            Fixtures
          </Link>
          <Link
            href="/membership"
            className={buttonVariants({
              variant: 'ghost',
              size: 'lg',
              className: 'text-white hover:bg-white/10',
            })}
          >
            Join the Club
          </Link>
        </div>
      </Container>
    </section>
  );
}
