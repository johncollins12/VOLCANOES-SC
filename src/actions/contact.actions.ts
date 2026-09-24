'use server';

import { prisma } from '@/lib/prisma';
import { contactMessageSchema } from '@/lib/validation/common';
import type { ActionResult } from '@/types';

/**
 * Public contact form submission — the last of the "linked but never
 * built" gaps found during the Production Readiness audit
 * (contactMessageSchema existed since Phase 0, but no page or action
 * ever used it). No auth required (this is the public-facing form);
 * staff review submissions at /admin/messages.
 */
export async function submitContactMessageAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return { success: true, data: undefined };
}
