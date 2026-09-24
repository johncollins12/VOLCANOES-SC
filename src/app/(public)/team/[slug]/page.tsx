import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/config/site';
import { Section, Container } from '@/components/ui/Container';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { PlayerProfileHeader } from '@/components/football/PlayerProfileHeader';
import { PlayerCard } from '@/components/football/PlayerCard';
import { getPlayerBySlug, getAllPlayerSlugs, getAdjacentPlayers, getRelatedPlayers } from '@/lib/data';

export const revalidate = 300;

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every active player's profile at build time — SEO-friendly static routes rather than a query-string ID. */
export async function generateStaticParams() {
  const slugs = await getAllPlayerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    return buildPageMetadata({
      title: 'Player Not Found',
      description: 'This player profile could not be found.',
      path: `/team/${slug}`,
      noIndex: true,
    });
  }

  const description = player.bio
    ? player.bio.slice(0, 155)
    : `${player.name}${player.position ? ` — ${player.position}` : ''} for ${SITE_CONFIG.name}.`;

  return buildPageMetadata({
    title: player.name,
    description,
    path: `/team/${player.slug}`,
    ogImage: player.photoUrl ?? undefined,
  });
}

/**
 * /team/[slug] — full player profile. SEO-friendly dynamic route (a
 * human-readable slug, not a raw UUID — see the ARCHITECTURAL ADDITION
 * comment on Player.slug in prisma/schema.prisma), statically generated
 * per player via generateStaticParams, with per-player social sharing
 * metadata via generateMetadata above and Person structured data below.
 */
export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) notFound();

  const [adjacent, related] = await Promise.all([
    getAdjacentPlayers(player.id),
    player.positionId ? getRelatedPlayers(player.positionId, player.id) : Promise.resolve([]),
  ]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name,
    ...(player.photoUrl ? { image: player.photoUrl } : {}),
    ...(player.nationality ? { nationality: player.nationality } : {}),
    memberOf: { '@type': 'SportsTeam', name: SITE_CONFIG.name },
    ...(player.position ? { jobTitle: player.position } : {}),
  };

  const stats = player.currentSeasonStats;
  const gk = stats?.goalkeeper ?? null;

  return (
    <Section>
      <Container>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <PlayerProfileHeader
          name={player.name}
          jerseyNumber={player.jerseyNumber}
          position={player.position}
          nationality={player.nationality}
          dateOfBirth={player.dateOfBirth}
          heightCm={player.heightCm}
          joinedDate={player.joinedDate}
          photoUrl={player.photoUrl}
        />

        {player.bio && (
          <div className="mt-10">
            <h2 className="mb-3 font-display text-xl font-semibold text-ink">Biography</h2>
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-ink/80">{player.bio}</p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">
            Season Statistics {stats && <span className="text-sm font-normal text-muted">({stats.seasonLabel})</span>}
          </h2>

          {!stats ? (
            <p className="text-sm text-muted">No statistics recorded for the current season yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatisticCard label="Appearances" value={stats.appearances} />
                <StatisticCard label="Goals" value={stats.goals} />
                <StatisticCard label="Assists" value={stats.assists} />
                <StatisticCard label="Minutes" value={stats.minutesPlayed} />
                <StatisticCard label="Yellow Cards" value={stats.yellowCards} />
                <StatisticCard label="Red Cards" value={stats.redCards} />
              </div>

              {gk && (
                <div className="mt-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                    Goalkeeper Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <StatisticCard label="Clean Sheets" value={gk.cleanSheets ?? '—'} />
                    <StatisticCard label="Saves" value={gk.saves ?? '—'} />
                    <StatisticCard label="Save %" value={gk.savePercentage != null ? `${gk.savePercentage}%` : '—'} />
                    <StatisticCard label="Penalties Saved" value={gk.penaltiesSaved ?? '—'} />
                    <StatisticCard label="Goals Conceded" value={gk.goalsConceded ?? '—'} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {(adjacent.previous || adjacent.next) && (
          <div className="mt-10 flex items-center justify-between border-y border-border py-4">
            {adjacent.previous ? (
              <Link href={`/team/${adjacent.previous.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-cyan">
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {adjacent.previous.name}
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next && (
              <Link href={`/team/${adjacent.next.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-cyan">
                {adjacent.next.name}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Related {player.position ? `${player.position}s` : 'Players'}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <PlayerCard
                  key={p.id}
                  name={p.name}
                  jerseyNumber={p.jerseyNumber}
                  position={p.position}
                  nationality={p.nationality}
                  photoUrl={p.photoUrl}
                  href={`/team/${p.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
