'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { emailSchema } from '@/lib/validation/common';
import type { ActionResult } from '@/types';

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

/**
 * Signs a staff member into the admin dashboard via Supabase Auth
 * (email/password). Registration of new staff accounts is intentionally
 * NOT self-service — accounts are provisioned by a SUPER_ADMIN via the
 * Users & Roles admin screen (built in a later phase), per the principle
 * of least privilege for a club-managed CMS.
 */
export async function signInAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: 'Incorrect email or password.' };
  }

  redirect('/admin');
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/**
 * Sends a Supabase password-reset email. This is a REAL implementation,
 * not a stub — Supabase Auth's `resetPasswordForEmail` works out of the
 * box using Supabase's default email templates. The one caveat worth
 * flagging: Supabase's default email sender has low rate limits and is
 * meant for testing — for production deliverability, configure a custom
 * SMTP provider in the Supabase project settings (see .env.example's
 * EMAIL_PROVIDER_API_KEY note). Always returns success regardless of
 * whether the email exists, to avoid leaking which addresses have accounts.
 */
export async function requestPasswordResetAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get('email'));

  if (!parsed.success) {
    return { success: false, error: 'Enter a valid email address.' };
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/reset-password`,
  });

  return { success: true, data: undefined };
}

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * Sets a new password for the session created by clicking the reset-email
 * link (Supabase establishes a temporary recovery session client-side
 * before this action runs — see /admin/reset-password/page.tsx).
 */
export async function updatePasswordAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect('/admin');
}
