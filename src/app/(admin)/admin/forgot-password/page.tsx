'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { LogoMark } from '@/components/layout/LogoMark';
import type { ActionResult } from '@/types';

const initialState: ActionResult | undefined = undefined;

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="font-display text-xl">Reset Password</h1>
            <p className="text-sm text-muted">
              Enter your staff email and we&apos;ll send a link to reset your password.
            </p>
          </div>

          {state?.success ? (
            <p className="text-center text-sm text-cyan">
              If an account exists for that email, a reset link is on its way.
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <Input id="email" name="email" type="email" label="Email" required autoComplete="username" />

              {state && !state.success && (
                <p role="alert" className="text-sm text-danger">
                  {state.error}
                </p>
              )}

              <Button type="submit" isLoading={isPending} className="w-full">
                Send reset link
              </Button>
            </form>
          )}

          <Link href="/admin/login" className="text-center text-sm text-cyan hover:underline">
            Back to sign in
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
