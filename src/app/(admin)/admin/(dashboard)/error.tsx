'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Error boundary for the entire /admin tree. Next.js requires error.tsx
 * to be a Client Component. Without this, an admin-side failure (a
 * Server Action throwing, a data-layer query failing outside its own
 * try/catch) would fall through to the root app/error.tsx, which is
 * styled for the public site (dark charcoal, marketing tone) — jarring and
 * off-brand for a staff tool, and it offers a "back to homepage" action
 * that isn't useful mid-task in the admin.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[admin error boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border px-6 py-20 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" aria-hidden />
      <p className="font-display text-lg text-ink">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted">
        An unexpected error occurred loading this page. You can try again, or navigate elsewhere using the sidebar.
      </p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
