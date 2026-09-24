import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Constrains content to the site's max reading/layout width with
 * responsive horizontal padding. Use this instead of repeating
 * `max-w-content mx-auto px-4` inline across every page/section.
 */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto max-w-content px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
}

/**
 * Standard vertical rhythm wrapper for page sections (hero, latest news,
 * next fixture, sponsors strip, etc.) so spacing stays consistent without
 * every feature re-deciding its own top/bottom padding.
 */
export function Section({ className, as: Tag = 'section', ...props }: SectionProps) {
  return <Tag className={cn('py-12 sm:py-16', className)} {...props} />;
}
