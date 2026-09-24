import Link from 'next/link';
import { Ticket, ShoppingBag, Users, Mail } from 'lucide-react';
import { Section, Container } from '@/components/ui/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const FAN_ACTIONS = [
  { label: 'Buy Tickets', href: '/tickets', icon: Ticket, description: 'Secure your seat for the next match.' },
  { label: 'Club Shop', href: '/shop', icon: ShoppingBag, description: 'Official jerseys and merchandise.' },
  { label: 'Membership', href: '/membership', icon: Users, description: 'Join the Den as a fan member.' },
  { label: 'Contact Club', href: '/contact', icon: Mail, description: 'Get in touch with SC Volcanoes.' },
] as const;

/**
 * Homepage "Fan Call-to-Action" section — four equal-weight destinations
 * built from the existing Card primitive (no new card component
 * introduced for this), each linking out to its own future page.
 */
export function FanCTASection() {
  return (
    <Section>
      <Container>
        <h2 className="mb-6 text-center font-display text-2xl font-semibold text-ink">Get Involved</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FAN_ACTIONS.map(({ label, href, icon: Icon, description }) => (
            <Link key={href} href={href} className="block">
              <Card className={cn('hover-lift h-full text-center')}>
                <CardBody className="flex flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="font-display text-base font-semibold text-ink">{label}</p>
                  <p className="text-xs text-muted">{description}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
