'use client';

import { useState, useEffect, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'onChange'> {
  id: string;
  label?: string;
  /** Fires on every keystroke (already debounced internally — see `debounceMs`). */
  onChange?: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

/**
 * Debounced search input with a leading icon and a clear ("×") button —
 * the site search bar (header + /search page) and any admin list's
 * "filter by name" field. Debouncing lives here (not in each consumer)
 * so every search experience in the app waits the same amount before
 * firing a query, instead of every page reinventing that timing.
 */
export function SearchBox({
  id,
  label = 'Search',
  onChange,
  debounceMs = 300,
  defaultValue = '',
  className,
  ...props
}: SearchBoxProps) {
  const [value, setValue] = useState(String(defaultValue));

  useEffect(() => {
    const timeout = setTimeout(() => onChange?.(value), debounceMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs]);

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={props.placeholder ?? 'Search…'}
        className={cn(
          'w-full rounded-card border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-ink',
          'placeholder:text-muted/70 focus:border-cyan focus:outline-none',
          className
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
