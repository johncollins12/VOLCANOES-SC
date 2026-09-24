'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  items: NavItem[];
  isOpen: boolean;
  onNavigate: () => void;
}

/**
 * Slide-down accordion menu for small screens — renders the same
 * PRIMARY_NAV data as the desktop Navbar/MegaMenu, just as a single-column
 * accordion (a mega-panel layout doesn't translate to mobile widths).
 * Extracted from Navbar.tsx so it can be reused as-is if a second header
 * variant is ever needed (e.g. an admin-facing marketing header).
 */
export function MobileNav({ items, isOpen, onNavigate }: MobileNavProps) {
  return (
    <nav className={cn('border-t border-border/20 lg:hidden', isOpen ? 'block' : 'hidden')} aria-label="Primary mobile">
      <div className="mx-auto flex max-w-content flex-col gap-1 px-4 py-3 sm:px-6">
        {items.map((item) => (
          <MobileNavItem key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link href={item.href!} onClick={onNavigate} className="rounded-card px-3 py-2 text-sm font-medium">
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-card px-3 py-2 text-sm font-medium"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div className="ml-3 flex flex-col gap-1 border-l border-border/20 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="rounded-card px-3 py-2 text-sm text-white/80"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
