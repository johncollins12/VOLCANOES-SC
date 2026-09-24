'use client';

import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDisplayDate, cn } from '@/lib/utils';

export interface VideoCardProps {
  title: string;
  categoryName?: string | null;
  thumbnailUrl?: string | null;
  publishedAt?: Date | string | null;
  onClick: () => void;
  className?: string;
}

/**
 * Video thumbnail teaser for the Video Centre grid — opening a video plays
 * it in place (see the Video Centre page's lightbox-style expand pattern,
 * matching how GalleryLightbox handles photos) rather than navigating to a
 * separate page per video.
 */
export function VideoCard({ title, categoryName, thumbnailUrl, publishedAt, onClick, className }: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'hover-lift group block w-full overflow-hidden rounded-card border border-border bg-surface text-left shadow-card',
        className
      )}
    >
      <div className="relative aspect-video bg-charcoal">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-charcoal to-charcoal-light" aria-hidden />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20 transition-colors group-hover:bg-charcoal/40">
          <PlayCircle className="h-12 w-12 text-white" aria-hidden />
        </div>
      </div>
      <div className="p-3">
        <div className="mb-1.5 flex items-center gap-2">
          {categoryName && <Badge variant="default">{categoryName}</Badge>}
          {publishedAt && <span className="text-xs text-muted">{formatDisplayDate(publishedAt)}</span>}
        </div>
        <p className="truncate font-display text-base font-semibold text-ink">{title}</p>
      </div>
    </button>
  );
}
