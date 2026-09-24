'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signInAction } from '@/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { LogoMark } from '@/components/layout/LogoMark';
import type { ActionResult } from '@/types';

const initialState: ActionResult | undefined = undefined;

/**
 * Staff sign-in screen for the admin dashboard. Deliberately minimal and
 * separate from the public site's visual language (no Navbar/Footer) —
 * this is a tool for staff, not a marketing surface.
 */
export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="font-display text-xl">Staff Login</h1>
            <p className="text-sm text-muted">Sign in to manage the SC Volcanoes website.</p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <Input id="email" name="email" type="email" label="Email" required autoComplete="username" />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              autoComplete="current-password"
            />

            {state && !state.success && (
              <p role="alert" className="text-sm text-danger">
                {state.error}
              </p>
            )}

            <Button type="submit" isLoading={isPending} className="mt-2 w-full">
              Sign in
            </Button>

            <Link href="/admin/forgot-password" className="text-center text-sm text-cyan hover:underline">
              Forgot password?
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
