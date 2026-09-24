import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Distinct from EmptyState (components/ui/Feedback.tsx): EmptyState means
 * "this genuinely has nothing yet" (e.g. no news published), ErrorState
 * means "something went wrong fetching this" (e.g. the DB call in
 * src/lib/data/*.ts threw). Conflating the two would tell a visitor
 * "there's no news" when the real problem is a failed request — this
 * gives an honest message and, when the caller provides one, a retry
 * action instead.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\u2019t load this content. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-card border border-danger/20 bg-danger/5 px-6 py-12 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-danger" aria-hidden />
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
