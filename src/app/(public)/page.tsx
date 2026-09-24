import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/config/site';
import {
  getLatestNews,
  getNextFixture,
  getRecentResults,
  getHomeLeagueTableSnapshot,
  getActiveSponsors,
  getFeaturedPlayers,
  getClubStatistics,
  getClubProfile,
} from '@/lib/data';
import {
  Hero,
  NextMatchSection,
  LatestNewsSection,
  FeaturedPlayersSection,
  LatestResultsSection,
  LeagueTableSnapshotSection,
  SponsorsStrip,
  ClubStatisticsSection,
  FanCTASection,
  NewsletterSection,
} from '@/components/home';

// ISR: homepage content (news, fixtures) changes often but doesn't need to
// be real-time — see architecture doc §1.3 "Rendering strategy per feature".
export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Home',
  description:
    'Official website of SC Volcanoes — latest news, fixtures, results, league standings, and more.', // ⚠️ CLUB INPUT NEEDED: refine once official positioning/copy is confirmed
  path: '/',
});

/**
 * Homepage. A Server Component that fetches every section's data in
 * parallel (Promise.all) and hands it down to presentational section
 * components under src/components/home/ — no section component queries
 * the database itself, keeping the data-fetching boundary at the page.
 *
 * Section order matches the approved Phase 2 spec exactly:
 * Hero -> Next Match -> Latest News -> Featured Players -> Latest Results
 * -> League Table Preview -> Sponsors -> Club Statistics -> Fan CTA ->
 * Newsletter -> Footer (Footer is rendered globally by
 * src/app/(public)/layout.tsx, not repeated here).
 *
 * Every section degrades gracefully to an honest empty state when the
 * corresponding data doesn't exist yet (see docs/CLUB_INFO_NEEDED.md for
 * what's still needed from the club) — nothing here is fabricated.
 */
export default async function HomePage() {
  const [latestNews, nextFixture, recentResults, tableResult, sponsors, featuredPlayers, clubStatistics, clubProfile] =
    await Promise.all([
      getLatestNews(3),
      getNextFixture(),
      getRecentResults(3),
      getHomeLeagueTableSnapshot(5),
      getActiveSponsors(),
      getFeaturedPlayers(4),
      getClubStatistics(),
      getClubProfile(),
    ]);

  // Minimal SportsTeam structured data for search engines. Fields left out
  // (logo, sameAs social profiles, address) until real values exist —
  // emitting placeholder URLs would be worse for SEO than omitting them.
  // `memberOf` uses SITE_CONFIG.competitionName (confirmed real info, not
  // a placeholder) rather than SITE_CONFIG.foundedYear-style ⚠️ fields.
  const foundedYear = clubProfile?.foundedYear ?? SITE_CONFIG.foundedYear;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    sport: 'Football',
    memberOf: { '@type': 'SportsOrganization', name: SITE_CONFIG.competitionName },
    ...(foundedYear ? { foundingDate: String(foundedYear) } : {}),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Hero
        backgroundImageUrl={clubProfile?.homepageHeroImageUrl}
        motto={clubProfile?.motto}
        foundedYear={clubProfile?.foundedYear}
      />
      <NextMatchSection nextFixture={nextFixture} />
      <LatestNewsSection articles={latestNews} />
      <FeaturedPlayersSection players={featuredPlayers} />
      <LatestResultsSection results={recentResults} />
      <LeagueTableSnapshotSection rows={tableResult.rows} isDemo={tableResult.isDemo} />
      <SponsorsStrip sponsors={sponsors} />
      <ClubStatisticsSection statistics={clubStatistics} />
      <FanCTASection />
      <NewsletterSection />
    </>
  );
}
