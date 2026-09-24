import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { LeagueTable, type LeagueTableRow } from '@/components/football/LeagueTable';
import { SITE_CONFIG } from '@/config/site';

interface LeagueTableSnapshotSectionProps {
  rows: LeagueTableRow[];
  /** True when `rows` is illustrative demo/preview data — see getHomeLeagueTableSnapshot in src/lib/data/league-table.ts. */
  isDemo?: boolean;
}

/**
 * Homepage league table teaser — top rows only (the club's own row is
 * guaranteed to be included even if outside that range; see
 * src/lib/data/league-table.ts). The full, unsliced standings live on
 * /table.
 */
export function LeagueTableSnapshotSection({ rows, isDemo }: LeagueTableSnapshotSectionProps) {
  return (
    <Section className="bg-surface-muted">
      <Container>
        <div className="mb-2 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">{SITE_CONFIG.competitionName} Table</h2>
          <Link href="/table" className="text-sm font-medium text-cyan hover:underline">
            Full table →
          </Link>
        </div>
        <p className="mb-6 text-sm text-muted">Track Volcanoes FC&rsquo;s position in the {SITE_CONFIG.competitionName}.</p>

        {isDemo && (
          <div className="mb-4 flex items-start gap-2 rounded-card border border-gold/40 bg-gold/10 p-3 text-sm text-ink">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <p>
              <strong>Demo/preview data</strong> — illustrative standings shown until real results are entered.
            </p>
          </div>
        )}

        {rows.length === 0 ? (
          <EmptyState
            title="Standings not available yet"
            description="The league table will appear here once the current season is set up and results start coming in."
          />
        ) : (
          <LeagueTable rows={rows} />
        )}
      </Container>
    </Section>
  );
}
