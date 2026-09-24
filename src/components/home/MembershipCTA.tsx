import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';

/**
 * Closing homepage CTA — drives the two commercial actions the club most
 * wants from a casual visitor (join as a fan member, buy tickets). Kept
 * as static copy for now; swap to props once MembershipPlan pricing is
 * confirmed (docs/CLUB_INFO_NEEDED.md §7.5) so real tier names/prices can
 * be teased here instead of generic copy.
 */
export function MembershipCTA() {
  return (
    <section className="bg-charcoal text-white">
      <Container className="flex flex-col items-center gap-5 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Join the Den</h2>
        <p className="max-w-lg text-white/70">
          Become a SC Volcanoes fan member and never miss a moment — details on tiers and
          benefits coming soon.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/membership" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
            Join Membership
          </Link>
          <Link
            href="/tickets"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'border-white/30 text-white hover:bg-white/10',
            })}
          >
            Buy Tickets
          </Link>
        </div>
      </Container>
    </section>
  );
}
