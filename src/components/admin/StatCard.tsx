/**
 * Thin re-export: the admin dashboard KPI tile is the same component as
 * the generic StatisticCard (src/components/ui/StatisticCard.tsx). Kept as
 * a re-export — rather than deleted — so existing imports
 * (`import { StatCard } from '@/components/admin'`) keep working.
 */
export { StatisticCard as StatCard, type StatisticCardProps as StatCardProps } from '@/components/ui/StatisticCard';
