import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { LeagueTable } from '@/components/football/LeagueTable';
import { CompetitionFilter } from '@/components/football/CompetitionFilter';
import { getFullLeagueTable, getCompetitions } from '@/lib/data';
import { SITE_CONFIG } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'League Table',
  description: "Track Volcanoes FC's position in the FUFA Big League.",
  path: '/table',
});

interface TablePageProps {
  searchParams: Promise<{ competition?: string }>;
}

/**
 * /table — the full current-season standings. Volcanoes FC's own row
 * is highlighted by LeagueTable (via `isOwnTeam`) and is the only
 * row with a Form indicator populated — see the SCHEMA LIMITATION comment
 * on LeagueTableRow.form (components/football/LeagueTable.tsx) for why
 * that can't be computed for other clubs with the current schema.
 *
 * Falls back to illustrative demo/preview standings (clearly bannered
 * below) when the season has no real results entered yet — see
 * getFullLeagueTable's `isDemo` flag in src/lib/data/league-table.ts.
 */
export default async function TablePage({ searchParams }: TablePageProps) {
  const { competition } = await searchParams;

  const [{ rows, isDemo }, competitions] = await Promise.all([getFullLeagueTable(competition), getCompetitions()]);

  return (
    <Section>
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Table</h1>
            <p className="mt-1 text-sm text-muted">Track Volcanoes FC&rsquo;s position in the {SITE_CONFIG.competitionName}.</p>
          </div>
          <CompetitionFilter competitions={competitions} />
        </div>

        {isDemo && (
          <div className="mb-4 flex items-start gap-2 rounded-card border border-gold/40 bg-gold/10 p-3 text-sm text-ink">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <p>
              <strong>Demo/preview data.</strong> No real season standings have been entered yet, so illustrative
              FUFA Big League standings are shown here to demonstrate the layout. These are not live results.
            </p>
          </div>
        )}

        {rows.length === 0 ? (
          <EmptyState
            title="Standings not available yet"
            description="The league table will appear here once the season's standings are entered from the admin dashboard."
          />
        ) : (
          <LeagueTable rows={rows} />
        )}
      </Container>
    </Section>
  );
}
