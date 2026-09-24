import Link from 'next/link';
import Image from 'next/image';
import { Images } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlbumCardProps {
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  imageCount: number;
  href: string;
  className?: string;
}

/**
 * Album teaser for the /gallery index. Distinct from GalleryCard (a single
 * photo thumbnail, no title/count) — an album card needs to show title,
 * description, and photo count, which is a different content shape
 * entirely, not just a restyle.
 */
export function AlbumCard({ title, description, coverImageUrl, imageCount, href, className }: AlbumCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'hover-lift group block overflow-hidden rounded-card border border-border bg-surface shadow-card',
        className
      )}
    >
      <div className="relative aspect-[4/3] bg-charcoal">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-slow group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-charcoal to-charcoal-light" aria-hidden />
        )}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-charcoal/80 px-2 py-0.5 text-xs font-medium text-white">
          <Images className="h-3 w-3" aria-hidden />
          {imageCount}
        </span>
      </div>
      <div className="p-3">
        <p className="truncate font-display text-base font-semibold text-ink">{title}</p>
        {description && <p className="mt-0.5 truncate text-xs text-muted">{description}</p>}
      </div>
    </Link>
  );
}
