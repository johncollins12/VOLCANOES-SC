import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal px-4 text-center text-white">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="max-w-sm text-white/70">The page you're looking for doesn't exist or has moved.</p>
      <Link
        href="/"
        className={cn(
          'mt-2 inline-flex h-11 items-center justify-center rounded-card bg-accent px-5 text-sm font-medium text-white hover:bg-accent-dark'
        )}
      >
        Back to home
      </Link>
    </div>
  );
}
