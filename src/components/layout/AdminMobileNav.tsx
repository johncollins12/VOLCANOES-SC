'use client';

import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Modal } from '@/components/feedback/Modal';
import { IconButton } from '@/components/ui/IconButton';
import { AdminNavLinks } from './AdminNavLinks';
import { signOutAction } from '@/actions/auth.actions';
import { LogoMark } from './LogoMark';
import type { AuthenticatedUser } from '@/types';

/**
 * REAL BUG FIX (Admin CMS phase): AdminSidebar was `hidden lg:flex` with
 * no mobile equivalent at all — a staff member on a phone had no way to
 * navigate the admin beyond whatever page they landed on directly. This
 * adds a top bar (visible only below `lg`) with a menu button that opens
 * the exact same AdminNavLinks content in a Modal, rather than a
 * previously-nonexistent bespoke drawer component.
 */
export function AdminMobileNav({ user }: { user: AuthenticatedUser }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface-muted p-4 lg:hidden">
      <div className="flex items-center gap-2 font-display text-base">
        <LogoMark className="h-7 w-7" />
        Admin
      </div>
      <IconButton icon={Menu} aria-label="Open admin menu" variant="outline" onClick={() => setOpen(true)} />

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Admin Menu" size="sm">
        <AdminNavLinks onNavigate={() => setOpen(false)} />
        <div className="mt-4 border-t border-border pt-4 text-sm">
          <p className="font-medium text-ink">{user.fullName}</p>
          <p className="text-ink/60">{user.roles.join(', ')}</p>
          <form action={signOutAction} className="mt-3">
            <button type="submit" className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent">
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </Modal>
    </header>
  );
}
