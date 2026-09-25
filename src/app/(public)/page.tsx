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
  getRecentGalleryImages,
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
  HomeGallerySlider,
} from '@/components/home';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Home',
  description:
    'Official website of SC Volcanoes — latest news, fixtures, results, league standings, and more.',
  path: '/',
});

export default async function HomePage() {
  const [latestNews, nextFixture, recentResults, tableResult, sponsors, featuredPlayers, clubStatistics, clubProfile, galleryImages] =
    await Promise.all([
      getLatestNews(3),
      getNextFixture(),
      getRecentResults(3),
      getHomeLeagueTableSnapshot(5),
      getActiveSponsors(),
      getFeaturedPlayers(4),
      getClubStatistics(),
      getClubProfile(),
      getRecentGalleryImages(8),
    ]);

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
      <HomeGallerySlider images={galleryImages} />
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