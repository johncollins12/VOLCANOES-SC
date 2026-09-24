import { LogOut } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { AdminNavLinks } from './AdminNavLinks';
import { signOutAction } from '@/actions/auth.actions';
import type { AuthenticatedUser } from '@/types';

/**
 * Persistent desktop admin sidebar (lg and up). Below that breakpoint,
 * AdminMobileNav renders the same AdminNavLinks content inside a Modal
 * drawer instead — see that component for why the sidebar alone isn't
 * responsive on its own.
 */
export function AdminSidebar({ user }: { user: AuthenticatedUser }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface-muted p-4 lg:flex">
      <div className="mb-6 flex items-center gap-2 font-display text-base">
        <LogoMark className="h-8 w-8" />
        Admin
      </div>

      <AdminNavLinks />

      <div className="mt-4 border-t border-border pt-4 text-sm">
        <p className="font-medium text-ink">{user.fullName}</p>
        <p className="text-ink/60">{user.roles.join(', ')}</p>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
