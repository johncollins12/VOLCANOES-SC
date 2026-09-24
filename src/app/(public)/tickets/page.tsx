import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tickets',
  description: 'Online ticketing for Volcanoes FC is coming soon.',
  path: '/tickets',
  noIndex: true,
});

export default function TicketsPage() {
  return (
    <ComingSoon
      title="Tickets — Coming Soon"
      description="Online ticket sales will open here once the club confirms a payment provider and ticketing policy. Check Fixtures for gate/match-day details in the meantime."
    />
  );
}
