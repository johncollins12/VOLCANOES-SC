'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';
import { submitContactMessageAction } from '@/actions/contact.actions';

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessageAction, undefined);
  const { toast } = useToast();
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Message sent', description: "We'll get back to you soon.", variant: 'success' });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="flex flex-col gap-4" key={state?.success ? 'sent' : 'form'}>
      <Input id="fullName" name="fullName" label="Full Name" required error={fieldErrors?.fullName?.[0]} />
      <Input id="email" name="email" type="email" label="Email" required error={fieldErrors?.email?.[0]} />
      <Input id="phone" name="phone" type="tel" label="Phone (optional)" error={fieldErrors?.phone?.[0]} />
      <Input id="subject" name="subject" label="Subject (optional)" error={fieldErrors?.subject?.[0]} />
      <Textarea id="message" name="message" label="Message" rows={5} required error={fieldErrors?.message?.[0]} />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      Send Message
    </Button>
  );
}
