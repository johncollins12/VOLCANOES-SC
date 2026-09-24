import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { formatDisplayDate, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface NewsCardProps {
  title: string;
  excerpt?: string | null;
  categoryName?: string | null;
  coverImageUrl?: string | null;
  publishedAt?: Date | string | null;
  href: string;
  className?: string;
  /** Larger "featured" layout for the top story on the News index/homepage. */
  featured?: boolean;
}

export function NewsCard({
  title,
  excerpt,
  categoryName,
  coverImageUrl,
  publishedAt,
  href,
  className,
  featured,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'hover-lift group block overflow-hidden rounded-card border border-border bg-surface shadow-card',
        featured && 'sm:col-span-2',
        className
      )}
    >
      <div className={cn('relative bg-charcoal', featured ? 'aspect-[16/7]' : 'aspect-[16/9]')}>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-slow group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-charcoal to-charcoal-light" aria-hidden />
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          {categoryName && <Badge variant="default">{categoryName}</Badge>}
          {publishedAt && <span className="text-xs text-muted">{formatDisplayDate(publishedAt)}</span>}
        </div>
        <h3 className={cn('font-display font-semibold text-ink', featured ? 'text-2xl' : 'text-lg')}>
          {title}
        </h3>
        {excerpt && <p className="mt-1.5 text-sm text-muted">{truncateText(excerpt, featured ? 220 : 120)}</p>}
      </div>
    </Link>
  );
}
