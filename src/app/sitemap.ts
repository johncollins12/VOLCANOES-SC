import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { getAllArticleSlugs, getAllPlayerSlugs, getAllAlbumIds, getAllMatchReportFixtureIds } from '@/lib/data';

/**
 * Generates /sitemap.xml. Every static public route plus every dynamic
 * route's real slugs/ids (published articles, active players, albums,
 * published match reports) — pulled from the same data-layer functions
 * each page's own generateStaticParams uses, so the sitemap can never
 * drift out of sync with what's actually pre-rendered.
 *
 * Admin routes are intentionally excluded (see robots.ts, which also
 * disallows crawling /admin entirely) — a sitemap is for content meant to
 * be discovered by search engines, not staff tooling.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, playerSlugs, albumIds, reportFixtureIds] = await Promise.all([
    getAllArticleSlugs(),
    getAllPlayerSlugs(),
    getAllAlbumIds(),
    getAllMatchReportFixtureIds(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: SITE_CONFIG.url, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_CONFIG.url}/fixtures`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_CONFIG.url}/results`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_CONFIG.url}/table`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${SITE_CONFIG.url}/team`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_CONFIG.url}/news`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_CONFIG.url}/match-reports`, changeFrequency: 'weekly', priority: 0.6 },
      { url: `${SITE_CONFIG.url}/gallery`, changeFrequency: 'weekly', priority: 0.5 },
      { url: `${SITE_CONFIG.url}/videos`, changeFrequency: 'weekly', priority: 0.5 },
      { url: `${SITE_CONFIG.url}/club/history`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${SITE_CONFIG.url}/club/vision-mission`, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${SITE_CONFIG.url}/club/management`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${SITE_CONFIG.url}/club/technical-staff`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${SITE_CONFIG.url}/contact`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_CONFIG.url}/sponsors`, changeFrequency: 'monthly', priority: 0.3 },
      // /shop, /tickets, /membership are intentionally excluded — they're
      // "Coming Soon" placeholders (noIndex in their own metadata too),
      // not real content worth search engines discovering yet.
    ] as const
  ).map((entry) => ({ ...entry, lastModified: new Date() }));

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const playerRoutes: MetadataRoute.Sitemap = playerSlugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/team/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const albumRoutes: MetadataRoute.Sitemap = albumIds.map((id) => ({
    url: `${SITE_CONFIG.url}/gallery/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  const reportRoutes: MetadataRoute.Sitemap = reportFixtureIds.map((fixtureId) => ({
    url: `${SITE_CONFIG.url}/match-reports/${fixtureId}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...playerRoutes, ...albumRoutes, ...reportRoutes];
}
