import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminMobileNav } from '@/components/layout/AdminMobileNav';

/**
 * Auth guard for every protected admin page (everything under /admin
 * EXCEPT /admin/login, which lives in a sibling route group so it is never
 * wrapped by this guard — avoiding a redirect loop).
 *
 * Defense-in-depth note: this is the Server Component-level guard (layer 2
 * of 3 — see architecture §5). Supabase RLS (layer 1) still protects the
 * data even if this check were ever bypassed, and middleware.ts provides a
 * faster edge-level redirect before this layout even renders.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminMobileNav user={user} />
      <AdminSidebar user={user} />
      <div className="flex-1 bg-surface p-4 sm:p-6">{children}</div>
    </div>
  );
}
