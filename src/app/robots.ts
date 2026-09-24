import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

/**
 * Generates /robots.txt. Blocks the entire /admin tree from crawlers —
 * staff tools should never be indexed — and points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
