'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Section, Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';
import { subscribeToNewsletterAction } from '@/actions/newsletter.actions';

/**
 * Homepage "Newsletter Signup" section. Built from the existing Input and
 * Button components — no new form primitive introduced. See
 * src/actions/newsletter.actions.ts — subscribers are now persisted to
 * the NewsletterSubscriber table (added in the Admin CMS phase) and
 * manageable from /admin/newsletter.
 */
export function NewsletterSection() {
  const [state, formAction] = useActionState(subscribeToNewsletterAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Subscribed', description: "You're on the list — thanks for joining!", variant: 'success' });
    }
  }, [state, toast]);

  return (
    <Section className="bg-charcoal text-white">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-2xl font-semibold">Stay in the Loop</h2>
        <p className="max-w-md text-sm text-white/70">
          Get match reminders and club news straight to your inbox.
        </p>

        <form action={formAction} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              required
              className="bg-white text-ink"
              error={state && !state.success ? state.fieldErrors?.email?.[0] : undefined}
            />
          </div>
          <SubmitButton />
        </form>
      </Container>
    </Section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="shrink-0">
      Subscribe
    </Button>
  );
}
