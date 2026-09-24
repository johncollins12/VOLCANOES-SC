import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  id: string;
  label: string;
  description?: string;
  error?: string;
}

/**
 * Accessible checkbox: a real <input type="checkbox"> (never a styled
 * <div>) so it's natively keyboard- and screen-reader-operable, with a
 * custom-painted box layered visually via peer/sibling selectors. Used for
 * "remember me", terms acceptance, multi-select filters, and admin bulk
 * row selection.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
              className={cn('peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-border bg-surface', 'checked:border-accent checked:bg-accent', 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', 'disabled:cursor-not-allowed disabled:opacity-50', className)}
              {...props}
            />
            <Check
              className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100"
              aria-hidden
            />
          </span>
          <span className="text-sm">
            <span className="font-medium text-ink">{label}</span>
            {description && <span className="block text-muted">{description}</span>}
          </span>
        </label>
        {error && (
          <p id={`${id}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
