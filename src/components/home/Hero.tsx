import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';
import { LogoMark } from '@/components/layout/LogoMark';
import { SITE_CONFIG } from '@/config/site';
import { HeroBackgroundSlideshow } from './HeroBackgroundSlideshow';
import type { GalleryImageForSlider } from '@/lib/data/gallery';

export interface HeroProps {
  backgroundImageUrl?: string | null;
  backgroundImages?: GalleryImageForSlider[];
  motto?: string | null;
  foundedYear?: number | null;
}

export function Hero({ backgroundImageUrl, backgroundImages, motto, foundedYear }: HeroProps) {
  const resolvedMotto = motto || SITE_CONFIG.tagline;
  const resolvedFoundedYear = foundedYear ?? SITE_CONFIG.foundedYear;
  const hasSlideshow = (backgroundImages?.length ?? 0) > 0;

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      {hasSlideshow ? (
        <HeroBackgroundSlideshow images={backgroundImages!} />
      ) : backgroundImageUrl ? (
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
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/50 to-charcoal/80" aria-hidden />

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

                <h1 className="font-display text-4xl font-bold leading-tight drop-shadow-lg sm:text-6xl">{SITE_CONFIG.name}</h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/80 drop-shadow">{SITE_CONFIG.nickname}</p>


                <p className="max-w-xl text-base text-white/85 drop-shadow sm:text-lg">
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