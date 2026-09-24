import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Inline loading indicator — use inside buttons, cards, or full-page
 * loading.tsx files so every loading state in the app looks the same.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-accent',
        className
      )}
    />
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

/**
 * Standard "nothing here yet" state — used for empty admin lists (no news
 * yet, no fixtures yet) and empty public listings alike. Per the copy
 * guidance in our design principles: an empty screen is an invitation to
 * act, not an apology, so always pair this with a clear next action where
 * one exists.
 */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
      {icon}
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
