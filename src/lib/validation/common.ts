import { z } from 'zod';

/**
 * Reusable Zod primitives shared across every feature's validation schema
 * (e.g. src/lib/validation/news.ts in Phase 3). Defining these once keeps
 * error messages consistent and avoids re-deriving the same regex/rules
 * per entity.
 */

export const emailSchema = z.string().trim().email('Enter a valid email address.');

// Loose E.164-ish check that still accepts common Ugandan formats
// (+256 7XX XXX XXX or 07XX XXX XXX). Refine once the club confirms
// which phone formats their forms must accept (architecture §7).
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,15}$/, 'Enter a valid phone number.')
  .optional()
  .or(z.literal(''));

export const nonEmptyString = (fieldLabel: string) =>
  z.string().trim().min(1, `${fieldLabel} is required.`);

export const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, and hyphen-separated.');

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const contactMessageSchema = z.object({
  fullName: nonEmptyString('Full name'),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(2000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
