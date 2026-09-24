# Club Information Checklist

Living checklist mirroring architecture doc §7. Check items off as the club
provides them, and note where each has been entered (e.g. "entered in
ClubProfile via admin, 2026-08-01"). Keep this file up to date — it's the
fastest way for anyone on the project to see what's still a placeholder.

## Brand & Identity
- [ ] Official crest/logo (high-res, transparent PNG/SVG) — currently a placeholder monogram (`LogoMark.tsx`)
- [x] Brand color **roles** confirmed: dark charcoal (primary base), crimson red (primary accent), bright cyan blue (secondary accent), muted gold (warm accent), white (neutral light), dark earth brown (neutral dark) — see `DESIGN_SYSTEM.md`. Exact hex shades are our proposed premium tones; confirm against an official kit/brand guideline if one exists.
- [ ] Preferred typography, if any
- [ ] Official club name usage rules (e.g. "Volcanoes FC" vs "Volcanoes Football Club")
- [ ] Founding year, founder(s)
- [ ] Full club history narrative
- [ ] Official vision statement
- [ ] Official mission statement
- [ ] Club motto/slogan
- [ ] Stadium/home ground name and address
- [ ] Contact details (phone, email, address, office hours)
- [ ] Production domain (site currently falls back to a placeholder `.example` URL — see `docs/DEPLOYMENT.md`)

## People
- [ ] Management team (names, titles, bios, headshots)
- [ ] Technical staff (names, roles, bios, headshots)
- [ ] Board members (if featured)

## Football Data
- [ ] Current squad list (names, numbers, positions, DOB, nationality, joined date, headshots)
- [x] League(s)/competition(s) — **confirmed: FUFA Big League** (Uganda's second tier)
- [ ] Season structure/dates (e.g. exact 2025/26 season start/end dates)
- [ ] Fixtures/results/table data source (official FUFA Big League API/site, or manual entry) — the demo/preview league table shown on the public site (`src/lib/data/demo-league-table.ts`) is illustrative only and must be replaced by real admin-entered standings before launch
- [ ] Historical honours/trophies

## Content Operations
- [ ] Who writes news, and cadence
- [ ] Existing photo/video archive to migrate
- [ ] Preferred video hosting (YouTube/Vimeo/self-hosted)
- [ ] Social media handles (Facebook, X, Instagram, TikTok, YouTube)

## Commercial
- [ ] Sponsor list, tiers, logos, contract terms
- [ ] Shop: initial product list, fulfillment owner, payment methods, shipping policy, currency/tax rules
- [ ] Ticketing: online sales yes/no, categories & prices, payment provider, refund policy
- [ ] Membership: paid or not, tiers, pricing, benefits, physical card needed?

## Compliance & Legal
- [ ] Privacy Policy / Terms of Service (exists, or needs drafting)
- [ ] Data protection stance (Uganda Data Protection and Privacy Act, 2019)
- [ ] Youth team safeguarding/consent policy, if applicable

## Access & Governance
- [ ] Staff needing admin accounts (names, emails, intended roles)
- [ ] Content approval workflow / sign-off authority
