'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Dark/light mode toggle. Pairs with the inline script in src/app/layout.tsx
 * (which sets the initial class before hydration to avoid a flash) — this
 * component only handles the interactive switch + persistence afterward.
 *
 * Preference is stored in localStorage under "theme" ("dark" | "light").
 * If the user has never chosen explicitly, the OS preference is used.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  // Avoid rendering an icon that might not match the real (post-hydration)
  // state during the brief window before the effect above runs.
  if (!mounted) {
    return <div className={cn('h-9 w-9', className)} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-card transition-colors hover:bg-charcoal-light',
        className
      )}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
