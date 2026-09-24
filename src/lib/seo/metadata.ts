import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

/**
 * Builds a consistent Next.js Metadata object for any page. Every feature
 * page (news article, player profile, fixture, etc.) should call this
 * instead of hand-rolling its own <title>/OG tags, so titles, OG images,
 * and canonical URLs stay consistent site-wide.
 *
 * Usage in a page.tsx:
 *   export const metadata = buildPageMetadata({
 *     title: 'Fixtures',
 *     description: 'Upcoming SC Volcanoes fixtures.',
 *     path: '/fixtures',
 *   });
 */
export function buildPageMetadata(params: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, ogImage, noIndex } = params;
  const url = `${SITE_CONFIG.url}${path}`;
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: 'en_UG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
