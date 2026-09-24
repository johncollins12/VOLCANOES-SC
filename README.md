# Volcanoes FC — Digital Platform

Official website and admin CMS for Volcanoes FC — a complete, production-ready football club platform.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS 3 · PostgreSQL · Prisma ORM · Supabase (Auth + Storage)

## Status: Production-ready, pending real infrastructure

All planned phases are complete: architecture, design system, component library, homepage, football module (fixtures/results/table), team & player profiles, news/match reports/media, full admin CMS, and this final production-readiness pass. See **[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)** for exactly what's needed to go live, and **[`docs/CLUB_INFO_NEEDED.md`](./docs/CLUB_INFO_NEEDED.md)** for what real club content is still outstanding.

## What's included

**Public site:** Homepage · Fixtures · Results · League Table · Squad & Player Profiles · News · Match Reports · Photo Gallery · Video Centre · Newsletter signup

**Admin CMS** (`/admin`): Dashboard · News · Fixtures & Results · Player Management · Staff Management · Sponsors · Gallery · Videos · Media Library · Messages/Inbox · Newsletter Subscribers · Settings · User & Role Management · Activity Log (documented as not-yet-implemented — see that page)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in real values (see docs/ENVIRONMENT.md)
cp .env.example .env.local

# 3. Push the schema to your Supabase Postgres instance
npm run prisma:generate
npm run prisma:migrate

# 4. Seed reference data (roles, positions, categories — NOT fake club content)
npm run prisma:seed

# 5. Run the dev server
npm run dev

# 6. Run the test suite
npm test
```

The first admin account must be created directly in Supabase (Auth + a matching `User`/`UserRole` row) — see **[`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md#first-login)**. Every subsequent staff account can be created from `/admin/users` once that first account exists.

## Documentation

| Doc | Covers |
|---|---|
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Full deployment checklist, required infrastructure, environment variables |
| [`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md) | How club staff use every admin module |
| [`docs/ENVIRONMENT.md`](./docs/ENVIRONMENT.md) | Every environment variable, what it's for, where to get it |
| [`docs/TESTING.md`](./docs/TESTING.md) | What's tested, how to run it, how to extend it |
| [`docs/CLUB_INFO_NEEDED.md`](./docs/CLUB_INFO_NEEDED.md) | Real club data still needed before launch |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Full visual identity spec |

## Folder guide

```
prisma/                     schema.prisma (single source of truth for the DB) + seed.ts

src/app/
  (public)/                 Every public page (Navbar+Footer chrome via layout.tsx)
    [slug-based routes]     news/[slug], team/[slug], gallery/[id], match-reports/[fixtureId]
  (admin)/admin/
    login/                  Staff sign-in — outside the auth guard (avoids a redirect loop)
    (dashboard)/            Everything else under /admin — wrapped by the auth-guarded layout,
                             its own error.tsx/loading.tsx boundaries
  api/                      Route Handlers — newsletter CSV export today
  sitemap.ts / robots.ts    Generated SEO files — sitemap pulls real slugs/ids from the data layer
  layout.tsx                Root HTML shell: fonts (next/font/google, self-hosted at build time),
                             global metadata, theme-init script, ToastProvider
  globals.css                Design tokens (CSS variables, light+dark) + Tailwind base layer

src/components/
  ui/                        Design-system atoms (Button, Card, Input, Table, Modal-free primitives)
  layout/                    Navbar, Footer, AdminSidebar + AdminMobileNav, LogoMark, ThemeToggle
  football/                  Domain cards: PlayerCard, MatchCard (+ FixtureCard/ResultCard wrappers),
                              NewsCard, LeagueTable, SquadGrid, PlayerProfileHeader, etc.
  media/                     GalleryLightbox, VideoLightbox, VideoEmbed, ShareButtons, filters
  forms/                     Select, Checkbox, Radio, SearchBox, FileUpload (+ re-exported Input/Textarea)
  feedback/                  Modal, Toast, Skeleton, ErrorState (+ re-exported Spinner/EmptyState)
  cms/                       DataTable, Pagination/URLPagination, Breadcrumb, Tabs, RichTextEditor,
                              ImageUploadField, AdminSearchBox
  admin/                     AdminImageUpload, ConfirmDeleteModal, StatCard (re-exports StatisticCard)
  home/                      Homepage section components (Hero, NextMatchSection, etc.)

src/lib/
  prisma.ts                  Prisma client singleton
  supabase/                  Browser/server/service-role clients, storage helpers
  auth/                      getCurrentUser(), hasRole()/requireRole()
  data/                      ALL Prisma queries live here, one file per domain — pages and Server
                              Actions never query Prisma directly
  validation/                Shared Zod primitives
  seo/metadata.ts             buildPageMetadata() — canonical/OG/Twitter for every page
  sanitize.ts                 sanitizeRichText() — HTML sanitization for admin-authored rich text
  pagination.ts                Shared pagination math + response shape

src/actions/                 Server Actions, one file per entity — the only place that mutates data

src/config/
  site.ts                     Club brand/contact constants — the file to edit with real club info
  navigation.ts                Single source of truth for public nav + admin sidebar + footer
  roles.ts                     Role name constants, kept in sync with prisma/seed.ts

middleware.ts                 Refreshes the Supabase session cookie + fast-path redirects
                              unauthenticated visitors away from /admin/*
next.config.js                Image domains, security headers (including CSP)
vitest.config.ts              Test runner config — see docs/TESTING.md
```

## A note on versions

Targets **Next.js 16 / React 19** (current stable — Next 14 is EOL). **Tailwind stays on v3** (`tailwind.config.ts` + CSS variables) — v4's CSS-first config is a bigger structural change than this project needs; migrating later is an isolated task since no component depends on the config format.

## Design system

**Full documentation: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).** Quick summary: **White (primary) / Blue (secondary) / Red (accent)**, all CSS variables in `src/app/globals.css` consumed through Tailwind semantic tokens — never hardcode a hex value. Typography: Barlow Condensed (display), Inter (body), IBM Plex Mono (stats). Dark mode via a `.dark` class toggle; token *names* are identical between modes.

## Security model (defense in depth)

1. **Database** — Supabase Row Level Security policies (write these per-table before go-live — see `docs/DEPLOYMENT.md`)
2. **Application** — `requireUser()` / `requireRole()` in every Server Action (`src/lib/auth/`)
3. **Edge** — `middleware.ts` fast-redirects unauthenticated visitors before a page renders
4. **Content** — `sanitizeRichText()` strips dangerous HTML from admin-authored article/report bodies before they're stored (see `src/lib/sanitize.ts`)
5. **UI** — conditional rendering (hiding buttons/menus) is cosmetic only, never the sole protection

## Conventions

- Strict TypeScript throughout, `noUncheckedIndexedAccess` enabled
- All mutations go through Server Actions in `src/actions/` — never a direct Prisma call from a Client Component
- All user input is validated with Zod before touching the database
- All rich-text HTML is sanitized before being persisted (`sanitizeRichText`)
- Every list-returning query uses `resolvePagination`/`toPaginatedResult`
- Anything awaiting real club data is marked `⚠️` in code and tracked in `docs/CLUB_INFO_NEEDED.md`
- Genuine schema/infrastructure limitations are documented in code comments where they occur (search for "SCHEMA LIMITATION" and "REAL BUG FIX") rather than worked around with fabricated data

## Known limitations (honest, not hidden)

- **Activity/audit log**: no such model exists in the schema yet. `/admin/activity-log` documents exactly what adding one would require rather than showing fabricated entries.
- **Media Library** (`/admin/media`) is a live Supabase Storage file browser, not a database-backed asset catalog — there's no reverse index from a stored file back to which DB rows reference its URL, so deleting a still-referenced file will leave a broken image there.
- **League table "Form"** only populates for Volcanoes FC's own row — opponents are free-text names on `Fixture`, not linked `Team` records with their own match history.
- **League table demo/preview fallback**: until real `LeagueTableEntry` rows exist for the current season, both the homepage snapshot and `/table` show illustrative FUFA Big League standings (`src/lib/data/demo-league-table.ts`) with a visible "Demo/preview data" banner. These are not real results — replace with actual admin-entered standings before treating the site as launch-ready.
- **Video embeds**: only YouTube renders today (`VideoEmbed.tsx`); Vimeo/direct-upload are recorded in the schema but not yet playable on the public site.
- **CSP** allows `'unsafe-inline'` on `script-src`/`style-src` — required for Next.js's own hydration bootstrap; a nonce-based CSP would need additional middleware work.
- **This sandbox cannot reach `binaries.prisma.sh` or `fonts.googleapis.com`**, so `npm run build` cannot fully complete *inside this development/review environment specifically* — confirmed via a temporary font substitution that the entire app otherwise compiles cleanly with Turbopack. Both will work normally in any real deployment environment with standard internet access. See `docs/DEPLOYMENT.md`.
