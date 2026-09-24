'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query in React state (e.g. for switching a table to a
 * card layout below a breakpoint). SSR-safe: returns `false` on the server
 * and until the first client effect runs, to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
