# Deployment Guide

This covers what's needed to take this repository from "code complete" to "live in production." Read this alongside the root [`README.md`](../README.md) and [`docs/ENVIRONMENT.md`](./ENVIRONMENT.md).

## 1. Infrastructure you need to provision (outside this repo)

None of these can be set up from inside the codebase — they're accounts/services the club (or whoever holds the deployment) needs to create:

1. **A Supabase project** (Postgres + Auth + Storage). Free tier is enough to start.
   - Create the project, note the project URL and keys (Settings → API).
   - Under **Storage**, create these buckets, all set to **public read**: `club-assets`, `player-photos`, `staff-photos`, `gallery`, `video-thumbnails`, `news-images`, `sponsor-logos`, `shop-products`. Bucket names must match `src/lib/supabase/storage.ts` exactly.
   - Under **Authentication → Email Templates**, customize the "Invite user" template if desired (this is the email new staff accounts receive — see `createUserAction` in `src/actions/users.actions.ts`).
2. **A domain** for the site, with DNS pointed at wherever you host (see §3).
3. **A hosting platform.** This project targets Vercel (zero-config Next.js support) but any platform that runs Next.js 16 with Node 18.18+ works.
4. **(Optional, deferred) A payment gateway** — Flutterwave, Pesapal, Stripe, or a Mobile Money aggregator — only needed once Shop/Tickets/Membership move past their current "Coming Soon" placeholders. See `docs/CLUB_INFO_NEEDED.md` §7.5.
5. **(Optional) An email provider** (Resend, SendGrid, etc.) if you want transactional emails beyond what Supabase Auth sends natively (invites, password resets). Nothing in this codebase currently requires one — contact form submissions are stored in `ContactMessage` and reviewed at `/admin/messages`, not emailed out.

## 2. Database setup

```bash
# From your local machine or CI, with DATABASE_URL/DIRECT_URL pointed at Supabase:
npm run prisma:generate
npm run prisma:migrate   # creates the initial migration + applies it
npm run prisma:seed      # seeds ONLY structural data: roles, positions, categories — never fake club content
```

`prisma:migrate` runs `prisma migrate dev`, which is fine for the first deploy. For subsequent schema changes in a real production database, use `prisma migrate deploy` in CI/CD instead (it doesn't prompt interactively and doesn't reset data).

## 3. Environment variables

See [`docs/ENVIRONMENT.md`](./ENVIRONMENT.md) for the full reference. At minimum, production needs:
`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

Set these in your hosting platform's environment variable settings (e.g. Vercel Project Settings → Environment Variables) — never commit `.env.local`.

## 4. First deploy checklist

- [ ] Supabase project created, all 8 storage buckets created (public read)
- [ ] Environment variables set in the hosting platform
- [ ] `npm run prisma:migrate` run against the production database
- [ ] `npm run prisma:seed` run once (roles/positions/categories)
- [ ] First `SUPER_ADMIN` account created directly in Supabase (see `docs/ADMIN_GUIDE.md#first-login`) — every other staff account can then be created from `/admin/users`
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain (affects canonical URLs, OG tags, sitemap)
- [ ] DNS pointed at the hosting platform, HTTPS certificate issued (automatic on Vercel)
- [ ] Supabase Row Level Security policies written per-table (see §5 below — **do this before real data goes in**)
- [ ] Real club content entered via `/admin` (see `docs/CLUB_INFO_NEEDED.md` for the full list of what's still a placeholder)

## 5. Row Level Security (RLS) — do this before launch

The application-layer RBAC (`requireUser()`/`requireRole()` in every Server Action) is real and enforced, but it's only one of the three defense-in-depth layers described in the architecture doc. **Supabase RLS policies have not been written yet** — they need to be added per-table in the Supabase dashboard (or via a migration) before this goes live with real data, so that even a bug in application code, or a request that bypasses the Next.js layer entirely (e.g. someone hitting the Supabase REST API directly with a leaked anon key), can't read/write data it shouldn't.

Minimum policy shape for every table: public tables (NewsArticle, Fixture, Player, etc.) get a `SELECT` policy scoped to `status = 'PUBLISHED'` (or equivalent) for the `anon` role, and no `INSERT`/`UPDATE`/`DELETE` for `anon` at all (those only ever happen server-side via the service-role-adjacent Prisma connection, not the browser Supabase client).

## 6. Verifying the build yourself

This repository's own review/development sandbox could not complete a full `npm run build` because two external hosts are unreachable from *that specific environment*: `binaries.prisma.sh` (Prisma's engine downloads) and `fonts.googleapis.com` (next/font's one-time font fetch). Both are ordinary public CDNs reachable from any normal environment — GitHub Actions, Vercel, a local laptop with internet access — so this is not expected to recur. Confirmed on this project:
- `tsc --noEmit` — clean
- Full Turbopack compile of every route and component — clean (verified with a temporary font substitution to isolate the two network-blocked steps)
- `npm test` — 22/22 passing

Before your first real deploy, run `npm run build` yourself locally or in CI with normal internet access to get the final confirmation this sandbox couldn't complete.

## 7. Vercel-specific notes

No `vercel.json` is included — Vercel auto-detects Next.js and needs no extra config for this project. If you deploy elsewhere, ensure:
- Node 18.18+
- The build command is `npm run build`, output is the default `.next`
- Environment variables are available at **build time** (Prisma client generation needs `DATABASE_URL`)
