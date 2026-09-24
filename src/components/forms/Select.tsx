import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  /** Shown as a disabled first option (e.g. "Choose a position…") when the field has no default value. */
  placeholder?: string;
}

/**
 * Styled native <select> — deliberately not a custom-rendered listbox.
 * A real <select> gets correct keyboard behavior, screen reader support,
 * and (crucially, given this is used from Uganda on a wide range of
 * devices) the native mobile picker UI for free, at zero extra JS cost.
 * Used for filters (position, season, category) and admin CRUD forms.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, options, placeholder, required, ...props }, ref) => {
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            defaultValue={props.value === undefined ? (props.defaultValue ?? (placeholder ? '' : undefined)) : undefined}
            className={cn(
              'w-full appearance-none rounded-card border border-border bg-surface px-3.5 py-2.5 pr-9 text-sm text-ink',
              'focus:border-cyan focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${id}-hint`} className="text-sm text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
