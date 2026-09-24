import { Construction } from 'lucide-react';
import { Section, Container } from '@/components/ui/Container';

interface ComingSoonProps {
  title: string;
  description: string;
}

/**
 * Shared "not live yet" page for Shop, Tickets, and Membership —
 * genuinely different from every other page fixed in the Production
 * Readiness audit: those were missing pages over data that already
 * existed (ClubProfile, StaffMember, Sponsor). These three are missing
 * pages over a decision that hasn't been made yet — which payment
 * gateway (Flutterwave/Pesapal/Stripe/Mobile Money), per
 * docs/CLUB_INFO_NEEDED.md §7.5 — so there's no honest way to build a
 * working checkout today. This tells visitors the truth (coming soon)
 * instead of a bare 404 or a fabricated storefront with no working
 * payment behind it.
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-4 py-20 text-center">
        <Construction className="h-10 w-10 text-muted" aria-hidden />
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        <p className="max-w-md text-sm text-muted">{description}</p>
      </Container>
    </Section>
  );
}
