import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from './Button';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-charcoal text-white hover:bg-charcoal-light',
  outline: 'border border-border bg-transparent text-ink hover:bg-surface-muted',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:opacity-90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  /** REQUIRED, not optional — an icon-only button has no accessible name without it. */
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Returns the exact classes <IconButton> uses, for an <a> that needs
 * icon-button styling but must not literally be a <button> (e.g. a share
 * link opening an external site) — same rationale and pattern as
 * `buttonVariants()` in Button.tsx. Pair with `ICON_SIZE_CLASSES[size]` on
 * the icon itself, since the icon's size isn't part of this class string.
 */
export function iconButtonVariants({
  variant = 'ghost',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-card transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

/**
 * Icon-only button — close buttons, mobile menu toggle, carousel arrows,
 * table row actions, etc. Square hit target sized for touch (min 32px at
 * `sm`) rather than shrink-wrapped to the icon, per WCAG target-size
 * guidance. `aria-label` is a required prop (not optional like on a plain
 * <button>) because there is no visible text for assistive tech to read.
 *
 * For a link that needs this same styling, use `iconButtonVariants()` on
 * an <a>/<Link> instead — do not render a <button> inside an anchor.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'ghost', size = 'md', className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={iconButtonVariants({ variant, size, className })}
        {...props}
      >
        <Icon className={ICON_SIZE_CLASSES[size]} aria-hidden />
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
