'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MatchCountdownProps {
  kickoffAt: Date | string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeLeft(kickoffAt: Date | string): TimeLeft | null {
  const diff = new Date(kickoffAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
  };
}

/**
 * Live "time until kickoff" readout for the homepage Next Match section
 * and fixture detail pages. Ticks once a minute (not once a second) —
 * minute precision is all a countdown to a days-away match needs, and a
 * 60x-slower interval means 60x fewer re-renders, which matters more here
 * for performance than any user-visible benefit of second-level ticking.
 *
 * Renders nothing once kickoff has passed — MatchStatusBadge (LIVE/FT) is
 * the correct signal at that point, not a countdown reading "0:00:00".
 */
export function MatchCountdown({ kickoffAt, className }: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(kickoffAt));

  useEffect(() => {
    setTimeLeft(getTimeLeft(kickoffAt));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(kickoffAt)), 60_000);
    return () => clearInterval(interval);
  }, [kickoffAt]);

  if (!timeLeft) return null;

  return (
    <div role="timer" aria-label="Time until kickoff" className={cn('flex items-center justify-center gap-4', className)}>
      <Unit value={timeLeft.days} label="Days" />
      <Unit value={timeLeft.hours} label="Hrs" />
      <Unit value={timeLeft.minutes} label="Min" />
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl font-semibold tabular-nums text-ink">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}
