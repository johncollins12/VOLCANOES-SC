import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Generic surface container used for news teasers, player cards, fixture
 * cards, stat blocks, etc. Composition over configuration: build specific
 * card layouts (e.g. NewsCard) by combining this with feature-specific
 * content, rather than adding more props here.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border border-border bg-surface shadow-card', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-border p-4', className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t border-border p-4', className)} {...props} />;
}
