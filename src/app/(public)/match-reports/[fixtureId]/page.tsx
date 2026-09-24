import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/config/site';
import { Section, Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { MatchStatistics } from '@/components/football/MatchStatistics';
import { ShareButtons } from '@/components/media/ShareButtons';
import { formatDisplayDate } from '@/lib/utils';
import { getMatchReportByFixtureId, getAllMatchReportFixtureIds } from '@/lib/data';

export const revalidate = 300;

interface MatchReportPageProps {
  params: Promise<{ fixtureId: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllMatchReportFixtureIds();
  return ids.map((fixtureId) => ({ fixtureId }));
}

export async function generateMetadata({ params }: MatchReportPageProps): Promise<Metadata> {
  const { fixtureId } = await params;
  const report = await getMatchReportByFixtureId(fixtureId);

  if (!report) {
    return buildPageMetadata({
      title: 'Match Report Not Found',
      description: 'This match report could not be found.',
      path: `/match-reports/${fixtureId}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: report.title,
    description: `${report.homeTeamName} ${report.homeScore ?? '-'}\u2013${report.awayScore ?? '-'} ${report.awayTeamName} \u2014 ${report.competitionName}, ${formatDisplayDate(report.kickoffAt)}.`,
    path: `/match-reports/${report.fixtureId}`,
    ogImage: report.coverImageUrl ?? undefined,
  });
}

/**
 * /match-reports/[fixtureId] — scoreline header, venue/competition/date,
 * report body, match statistics "where available" (MatchStatistics
 * component returns null entirely when nothing was recorded), and share
 * buttons. Routes by fixture id rather than a slug — see the routing note
 * on MatchReportSummary in src/lib/data/match-reports.ts.
 */
export default async function MatchReportPage({ params }: MatchReportPageProps) {
  const { fixtureId } = await params;
  const report = await getMatchReportByFixtureId(fixtureId);

  if (!report) notFound();

  const reportUrl = `${SITE_CONFIG.url}/match-reports/${report.fixtureId}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: report.title,
    ...(report.coverImageUrl ? { image: [report.coverImageUrl] } : {}),
    ...(report.publishedAt ? { datePublished: report.publishedAt.toISOString() } : {}),
    ...(report.authorName ? { author: { '@type': 'Person', name: report.authorName } } : {}),
    publisher: { '@type': 'Organization', name: SITE_CONFIG.name },
    about: {
      '@type': 'SportsEvent',
      name: `${report.homeTeamName} vs ${report.awayTeamName}`,
      startDate: report.kickoffAt.toISOString(),
    },
    mainEntityOfPage: reportUrl,
  };

  return (
    <Section>
      <Container className="max-w-3xl">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge>{report.competitionName}</Badge>
          <span className="text-sm text-muted">{formatDisplayDate(report.kickoffAt)}</span>
          {report.venueName && <span className="text-sm text-muted">· {report.venueName}</span>}
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-6 text-center">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <span className="text-lg font-semibold text-ink">{report.homeTeamName}</span>
            <span className="font-mono text-4xl font-bold text-ink">
              {report.homeScore ?? '-'}–{report.awayScore ?? '-'}
            </span>
            <span className="text-lg font-semibold text-ink">{report.awayTeamName}</span>
          </div>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-ink sm:text-4xl">{report.title}</h1>
        {report.authorName && <p className="mt-2 text-sm text-muted">By {report.authorName}</p>}

        {report.coverImageUrl && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-card bg-charcoal">
            <Image
              src={report.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </div>
        )}

        <div
          className="mt-8 text-sm leading-relaxed text-ink/90 [&_a]:text-cyan [&_a]:underline [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: report.body }}
        />

        {report.statistics && (
          <div className="mt-10 border-t border-border pt-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Match Statistics</h2>
            <MatchStatistics
              statistics={report.statistics}
              homeTeamName={report.homeTeamName}
              awayTeamName={report.awayTeamName}
            />
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <ShareButtons url={reportUrl} title={report.title} />
        </div>
      </Container>
    </Section>
  );
}
