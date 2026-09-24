'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Top-level error boundary. Next.js renders this for any uncaught error in
 * a Server or Client Component within this route segment. Kept generic and
 * calm ("something went wrong, try again") — never expose raw error/stack
 * details to end users in production.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ⚠️ Wire this up to real error monitoring (e.g. Sentry) once chosen.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal px-4 text-center text-white">
      <p className="font-mono text-sm text-danger">Error</p>
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="max-w-sm text-white/70">
        We hit a snag loading this page. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
