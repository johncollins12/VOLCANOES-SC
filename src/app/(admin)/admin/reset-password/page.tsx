'use client';

import { useActionState } from 'react';
import { updatePasswordAction } from '@/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { LogoMark } from '@/components/layout/LogoMark';
import type { ActionResult } from '@/types';

const initialState: ActionResult | undefined = undefined;

/**
 * Reached via the link in the password-reset email. Supabase's client
 * library detects the recovery token in the URL and establishes a
 * temporary session automatically before this form is submitted — no
 * manual token handling needed here.
 */
export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="font-display text-xl">Set New Password</h1>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <Input
              id="password"
              name="password"
              type="password"
              label="New password"
              required
              autoComplete="new-password"
              error={state && !state.success ? state.fieldErrors?.password?.[0] : undefined}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm new password"
              required
              autoComplete="new-password"
              error={state && !state.success ? state.fieldErrors?.confirmPassword?.[0] : undefined}
            />

            {state && !state.success && !state.fieldErrors && (
              <p role="alert" className="text-sm text-danger">
                {state.error}
              </p>
            )}

            <Button type="submit" isLoading={isPending} className="w-full">
              Update password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
