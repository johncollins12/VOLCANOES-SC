'use client';

import Image from 'next/image';
import { Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GalleryCardProps {
  imageUrl: string;
  caption?: string | null;
  onClick?: () => void;
  className?: string;
}

/**
 * Single photo thumbnail for the /gallery grid. Purely presentational —
 * `onClick` is provided by the parent, typically to open a lightbox/modal
 * (see components/feedback/Modal.tsx) rather than navigating away, since a
 * gallery is browsed in place. Works as a plain non-interactive image
 * (a <figure>, not a <button>) when `onClick` is omitted.
 */
export function GalleryCard({ imageUrl, caption, onClick, className }: GalleryCardProps) {
  const image = (
    <>
      <Image
        src={imageUrl}
        alt={caption ?? ''}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(min-width: 1024px) 25vw, 50vw"
      />
      {onClick && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/40">
          <Expand className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative aspect-square w-full overflow-hidden rounded-card bg-surface-muted',
          className
        )}
        aria-label={caption ? `Open photo: ${caption}` : 'Open photo'}
      >
        {image}
      </button>
    );
  }

  return (
    <figure className={cn('group relative aspect-square w-full overflow-hidden rounded-card bg-surface-muted', className)}>
      {image}
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
