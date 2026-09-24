import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  /** Renders a circle instead of a rounded rectangle — for avatar/crest placeholders. */
  circle?: boolean;
}

/**
 * A single shimmering placeholder block. Compose several of these to build
 * a skeleton matching a specific card's shape (see SkeletonCard below, or
 * build a bespoke layout inline) — this is the primitive, not a
 * one-size-fits-all skeleton screen.
 */
export function Skeleton({ className, circle }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse bg-surface-muted', circle ? 'rounded-full' : 'rounded-card', className)}
    />
  );
}

/**
 * Ready-made skeleton matching the common "image + title + subtitle" card
 * shape shared by NewsCard/PlayerCard/StaffCard — drop this in wherever
 * one of those cards is still loading, e.g. a grid's `.map()` fallback,
 * without hand-building the layout again at each call site.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-card border border-border bg-surface', className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
