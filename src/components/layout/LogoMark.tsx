import { SITE_CONFIG } from '@/config/site';

/**
 * Placeholder crest — a simple monogram + shield silhouette in the club's
 * confirmed identity (dark charcoal base, crimson accent, a thin gold
 * trim line — the one deliberately restrained use of the warm/gold
 * accent, appropriate for a crest's traditional metallic trim), standing
 * in until the club supplies official crest artwork
 * (docs/CLUB_INFO_NEEDED.md). Swap this file's contents for an
 * <img>/<Image> of the real crest — every place this is used (Navbar,
 * Footer, admin sidebar, favicon generation) updates automatically.
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={className}
      role="img"
      aria-label={`${SITE_CONFIG.shortName} crest placeholder`}
    >
      <path
        d="M20 1 L37 7 V21 C37 31 30 39 20 43 C10 39 3 31 3 21 V7 Z"
        fill="rgb(var(--color-charcoal))"
        stroke="rgb(var(--color-accent))"
        strokeWidth="1.5"
      />
      <path
        d="M20 3.3 L34.7 8.4 V21 C34.7 29.8 28.4 36.9 20 40.6 C11.6 36.9 5.3 29.8 5.3 21 V8.4 Z"
        stroke="rgb(var(--color-gold))"
        strokeWidth="0.75"
        fill="none"
        opacity="0.8"
      />
      <path d="M3 21 C3 21 12 24 20 24 C28 24 37 21 37 21" stroke="rgb(var(--color-accent))" strokeWidth="1.5" fill="none" />
      <text
        x="20"
        y="19"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="11.5"
        fill="#FFFFFF"
      >
        {SITE_CONFIG.shortCode}
      </text>
    </svg>
  );
}
