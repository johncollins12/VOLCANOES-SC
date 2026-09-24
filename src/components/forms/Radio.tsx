import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  /** Visually hide the legend while keeping it in the accessibility tree (e.g. when a heading above already states the question). */
  hideLegend?: boolean;
  className?: string;
}

/**
 * A full radio group (not a single radio in isolation — an isolated radio
 * button is rarely useful and easy to misuse without the surrounding
 * <fieldset>/<legend> that groups it with its siblings for assistive
 * tech). Used for single-choice filters (e.g. ticket category) and admin
 * settings toggles between more than two options.
 */
export function RadioGroup({
  name,
  legend,
  options,
  value,
  defaultValue,
  onChange,
  error,
  hideLegend,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className={cn('mb-1 text-sm font-medium text-ink', hideLegend && 'sr-only')}>{legend}</legend>
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <label key={option.value} htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
            <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                onChange={() => onChange?.(option.value)}
                className={cn(
                  'h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-surface',
                  'checked:border-[5px] checked:border-accent',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                )}
              />
            </span>
            <span className="text-sm">
              <span className="font-medium text-ink">{option.label}</span>
              {option.description && <span className="block text-muted">{option.description}</span>}
            </span>
          </label>
        );
      })}
      {error && <p className="text-sm text-danger">{error}</p>}
    </fieldset>
  );
}
