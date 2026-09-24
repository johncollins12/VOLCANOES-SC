'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { PRIMARY_NAV } from '@/config/navigation';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { LogoMark } from './LogoMark';

/**
 * Public site navigation. Renders entirely from PRIMARY_NAV
 * (src/config/navigation.ts) so adding/reordering nav items never requires
 * editing this component. Desktop: hover/click dropdowns, or a MegaMenu
 * panel for items flagged `mega: true`. Mobile: MobileNav accordion drawer.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-accent bg-charcoal text-white">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-wide">
          <LogoMark />
          <span>{SITE_CONFIG.shortName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-card px-3 py-2 text-sm font-medium hover:bg-charcoal-light"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup={item.mega ? 'menu' : 'true'}
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className="block rounded-card px-3 py-2 text-sm font-medium hover:bg-charcoal-light"
                >
                  {item.label}
                </Link>
              )}

              {item.children && openDropdown === item.label && (
                item.mega ? (
                  <MegaMenu item={item} onNavigate={() => setOpenDropdown(null)} />
                ) : (
                  <div className="absolute left-0 top-full mt-1 min-w-[200px] rounded-card border border-border bg-surface py-1 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:flex" />

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      <MobileNav items={PRIMARY_NAV} isOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
    </header>
  );
}
