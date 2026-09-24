import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = buildPageMetadata({
  title: 'Club Shop',
  description: 'The Volcanoes FC club shop is coming soon.',
  path: '/shop',
  noIndex: true,
});

export default function ShopPage() {
  return (
    <ComingSoon
      title="Club Shop — Coming Soon"
      description="Official merchandise will be available here once the club confirms a payment provider."
    />
  );
}
