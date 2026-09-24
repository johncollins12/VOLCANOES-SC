import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = buildPageMetadata({
  title: 'Membership',
  description: 'Fan membership for Volcanoes FC is coming soon.',
  path: '/membership',
  noIndex: true,
});

export default function MembershipPage() {
  return (
    <ComingSoon
      title="Fan Membership — Coming Soon"
      description="Membership tiers and benefits will be announced here once the club finalizes pricing and a payment provider."
    />
  );
}
