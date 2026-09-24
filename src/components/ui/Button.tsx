import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Red accent — the one high-energy CTA color. Use for the single most
  // important action per view (buy tickets, submit, sign in) — see
  // DESIGN_SYSTEM.md's "one accent action per screen" rule.
  primary: 'bg-accent text-white hover:bg-accent-dark',
  // Charcoal — the club's secondary color, used for lower-emphasis actions
  // that still need presence (e.g. "View all fixtures").
  secondary: 'bg-charcoal text-white hover:bg-charcoal-light',
  outline: 'border border-border bg-transparent text-ink hover:bg-surface-muted',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:opacity-90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Returns the exact classes <Button> uses, for any element that needs
 * button styling but must not literally be a <button> — most commonly a
 * Next.js <Link> used as a call-to-action. Nesting a real <button> inside
 * an <a> (e.g. via an "asChild" pattern) is invalid HTML and an
 * accessibility hazard (interactive-inside-interactive), so this is the
 * supported way to share styling instead:
 *
 *   <Link href="/tickets" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
 *     Buy Tickets
 *   </Link>
 */
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-card font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

/**
 * Base button used across the entire site (public CTAs and admin dashboard
 * actions alike). Keep this the single implementation — do not create
 * one-off styled <button> elements in feature components. For a link that
 * should look like a button, use `buttonVariants()` instead (see above).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
