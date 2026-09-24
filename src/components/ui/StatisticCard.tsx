import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatisticCardProps {
  label: string;
  /** Pass a dash ("—") rather than 0 when a real data source isn't wired up yet. */
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  className?: string;
}

/**
 * Generic single-metric tile: a label, a large value, an optional icon, and
 * an optional trend line. This is the one canonical implementation behind
 * both the "Statistics Card" (Cards category) and "Dashboard Stat Cards"
 * (CMS category) — the admin dashboard's `StatCard` is a thin re-export of
 * this component (see src/components/admin/StatCard.tsx) so existing pages
 * don't need to change their import.
 *
 * Deliberately quiet chrome (plain surface/border, no charcoal/red) so it stays
 * legible whether it's reporting a player's goal tally or an admin KPI —
 * accent color is reserved for `trend`, where red/blue carry meaning
 * (down/up) rather than decoration.
 */
export function StatisticCard({ label, value, icon: Icon, trend, className }: StatisticCardProps) {
  return (
    <div className={cn('rounded-card border border-border bg-surface p-5 shadow-card', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-card bg-surface-muted text-muted">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
      {trend && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            trend.direction === 'up' && 'text-cyan',
            trend.direction === 'down' && 'text-accent',
            trend.direction === 'flat' && 'text-muted'
          )}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}
