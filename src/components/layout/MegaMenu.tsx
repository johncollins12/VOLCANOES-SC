import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { NavItem } from '@/config/navigation';

interface MegaMenuProps {
  item: NavItem;
  onNavigate?: () => void;
}

/**
 * Rich desktop dropdown panel: a multi-column list of links (each with
 * optional supporting copy) plus an optional featured promo block. Used by
 * Navbar for any PRIMARY_NAV item with `mega: true` (see
 * src/config/navigation.ts) — a plain NavItem still gets the simpler
 * dropdown instead, so this only appears where the extra richness earns
 * its space (e.g. "Club", "Fixtures & Results").
 *
 * Purely presentational — Navbar owns open/close state and positions this
 * in an `absolute` wrapper; this component only renders the panel content.
 */
export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
  if (!item.children) return null;

  return (
    <div
      role="menu"
      aria-label={item.label}
      className="absolute left-1/2 top-full mt-1 w-[560px] -translate-x-1/2 rounded-card border border-border bg-surface p-2 shadow-lg"
    >
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-2 grid grid-cols-2 gap-1 p-2">
          {item.children.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={onNavigate}
              className="rounded-card p-3 hover:bg-surface-muted"
            >
              <p className="text-sm font-semibold text-ink">{link.label}</p>
              {link.description && <p className="mt-0.5 text-xs text-muted">{link.description}</p>}
            </Link>
          ))}
        </div>

        {item.featured && (
          <div className="col-span-1 rounded-card bg-charcoal p-4 text-white">
            <p className="font-display text-sm font-semibold">{item.featured.title}</p>
            <p className="mt-1 text-xs text-white/70">{item.featured.description}</p>
            <Link
              href={item.featured.href}
              role="menuitem"
              onClick={onNavigate}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              {item.featured.ctaLabel ?? 'Learn more'}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
