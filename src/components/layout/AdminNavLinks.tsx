import Link from 'next/link';
import { ADMIN_NAV } from '@/config/navigation';

/**
 * The nav link list itself, extracted out of AdminSidebar so the exact
 * same markup can render inside both the persistent desktop sidebar and
 * the mobile drawer (AdminMobileNav) — one source of truth for "what
 * admin navigation looks like," not two copies that could drift.
 */
export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Admin">
      {ADMIN_NAV.map((item) =>
        item.children ? (
          <div key={item.label} className="mt-3 first:mt-0">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-ink/50">{item.label}</p>
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className="block rounded-card px-3 py-2 text-sm text-ink hover:bg-surface"
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : (
          <Link
            key={item.label}
            href={item.href!}
            onClick={onNavigate}
            className="block rounded-card px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
