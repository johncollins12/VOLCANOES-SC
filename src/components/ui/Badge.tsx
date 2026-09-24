import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'live' | 'success' | 'muted';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  // Neutral informational tag (news category, sponsor tier)
  default: 'bg-cyan/10 text-cyan',
  // Reserved for genuinely live/urgent states — pair with the pulsing dot
  // utility (.animate-pulse-dot) at most once per view.
  live: 'bg-danger/10 text-danger',
  // Confirmed/positive state (FT, paid, delivered) — blue stands in for
  // green here, since the palette is intentionally red/blue/white only.
  success: 'bg-success/10 text-success',
  muted: 'bg-surface-muted text-muted',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Adds a small pulsing dot — use only for the `live` variant, and only once per view. */
  dot?: boolean;
}

/**
 * Small status/label pill — used for fixture status ("LIVE", "FT",
 * "Postponed"), news categories, sponsor tiers, order/ticket statuses, etc.
 */
export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
