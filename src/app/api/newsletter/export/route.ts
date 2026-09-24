import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/config/roles';
import { getAllActiveSubscriberEmails } from '@/lib/data';

/**
 * GET /api/newsletter/export — downloads a CSV of every active
 * subscriber's email. A Route Handler rather than a Server Action since
 * this needs to return a downloadable file with a Content-Disposition
 * header, not a React-consumable ActionResult.
 */
export async function GET() {
  const user = await requireUser();
  requireRole(user, ROLES.SUPER_ADMIN);

  const emails = await getAllActiveSubscriberEmails();
  const csv = ['email', ...emails].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
