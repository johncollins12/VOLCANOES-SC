import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Page-number pagination for admin lists (news, players, orders) and any
 * future paginated public list (e.g. /news, /gallery). Purely controlled —
 * the caller owns `page` state and re-fetches on change — so this has no
 * opinion on whether pagination is done via a Server Action re-fetch, a
 * URL search param, or client state.
 */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getVisiblePages(page, totalPages);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <IconButton
        icon={ChevronLeft}
        aria-label="Previous page"
        size="sm"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />

      {pageNumbers.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted">

          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              'h-9 min-w-9 rounded-card px-2 text-sm font-medium',
              p === page ? 'bg-accent text-white' : 'text-ink hover:bg-surface-muted'
            )}
          >
            {p}
          </button>
        )
      )}

      <IconButton
        icon={ChevronRight}
        aria-label="Next page"
        size="sm"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  const delta = 1;
  const range: (number | 'ellipsis')[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('ellipsis');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('ellipsis');
  if (total > 1) range.push(total);

  return range;
}
