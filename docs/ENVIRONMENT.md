# Environment Variables Reference

Copy `.env.example` to `.env.local` for local development. In production, set these in your hosting platform's environment variable settings — never commit real values.

## Required

| Variable | Where to get it | Notes |
|---|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string ("Transaction" / pooled) | Used by Prisma at runtime. Must include `?pgbouncer=true`. |
| `DIRECT_URL` | Same page, the non-pooled connection string | Prisma migrations need a direct (non-pooled) connection. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Public — safe in the browser bundle. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Public — safe in the browser bundle; access is still governed by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **Secret.** Server-only — bypasses RLS and grants Auth admin access (used to create/delete staff accounts in `src/actions/users.actions.ts`). Never expose to the client, never log it. |
| `NEXT_PUBLIC_SITE_URL` | Your real domain | Used for canonical URLs, Open Graph tags, JSON-LD, and the sitemap. Must be correct before launch. |
| `NEXT_PUBLIC_SITE_NAME` | — | Currently just `"Volcanoes FC"`; only change if the club's official name changes. |

## Not yet used by any code (reserved for future, out-of-scope features)

These exist in `.env.example` as placeholders for features described in the original architecture but **not built** in this codebase (Shop/Tickets/Membership checkout, site-wide search, analytics). Leave them blank until those features are actually implemented — setting them today has no effect.

| Variable | Would be needed for |
|---|---|
| `EMAIL_FROM_ADDRESS`, `EMAIL_PROVIDER_API_KEY` | Transactional email beyond Supabase Auth's own invite/reset emails (nothing currently sends custom email) |
| `PAYMENT_PROVIDER_PUBLIC_KEY`, `PAYMENT_PROVIDER_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` | Shop/Tickets/Membership checkout — see `docs/CLUB_INFO_NEEDED.md` §7.5 |
| `NEXT_PUBLIC_ANALYTICS_ID` | Site analytics (Google Analytics/Plausible) — not integrated anywhere |
| `SEARCH_PROVIDER_API_KEY`, `SEARCH_PROVIDER_HOST` | A dedicated search index (Meilisearch/Algolia) — site-wide search was never built; the only "search" today is the admin's simple `contains`-based DB filters (`AdminSearchBox`) and the public News category/search filter |

## A note on secrets

`SUPABASE_SERVICE_ROLE_KEY` is the single most sensitive value in this project — it bypasses every Row Level Security policy and can create/delete any Supabase Auth user. It's only ever read in `src/lib/supabase/server.ts` (`createSupabaseServiceRoleClient`) and only from server-only code (Server Actions, Route Handlers) — grep the codebase for `SUPABASE_SERVICE_ROLE_KEY` before adding any new usage, and never pass it through a prop, a `NEXT_PUBLIC_*` variable, or a client component.
