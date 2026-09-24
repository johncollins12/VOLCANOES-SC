# Volcanoes FC — Design System

**Status:** Finalized visual identity, v3 (supersedes the Mukono Tigers SC "White/Blue/Red" identity following the club's rebrand to Volcanoes FC).
**Official colors (confirmed by the club):** dark charcoal (primary base) · crimson red (primary accent) · bright cyan blue (secondary accent) · muted gold (warm accent) · crisp white (neutral light) · dark earth brown (neutral dark).

Every value below is implemented in code today — `src/app/globals.css` (tokens) and `tailwind.config.ts` (Tailwind mapping) are the source of truth; this document explains the *why* and the *usage rules*. If code and doc ever disagree, fix the one that's wrong rather than assuming either is right.

---

## Design references & direction

Inspired by the digital presentation of Manchester City, Arsenal, Real Madrid, Bayern Munich, and Al Ahly — what those sites share, regardless of individual club colors:

- **Confident white space.** Content breathes; chrome (nav/footer) is dark and grounding, content areas are bright and clean.
- **One accent, used sparingly.** Each club has exactly one "action color" and doesn't dilute it — every CTA, live indicator, and key stat pulls the eye the same way.
- **Bold, condensed display type** for scores and headlines, paired with a restrained, highly legible body face — never more than two typefaces.
- **Photography-first cards.** Player/news imagery does the emotional work; UI chrome stays quiet and gets out of the way.
- **Crisp data presentation.** League tables and stats use tabular alignment and generous row height — never cramped.

Volcanoes FC's own identity within that language: a **dark charcoal + crimson** pairing (rather than a club's traditional colored shirt as the chrome color) reads as serious, powerful, and composed — fitting a club named for volcanic force — while a disciplined touch of **gold** (used only for badges, honours, and the crest's trim, never as a dominant fill) adds warmth without diluting the crimson's role as *the* action color. **Cyan** carries every "informational/positive" state that would otherwise default to green. **Dark earth brown** is used sparingly as an alternate dark section tone, distinct from charcoal, for spots wanting a warmer, more grounded feel (e.g. heritage/history content) — white keeps every page feeling premium and uncluttered rather than heavy.

---

## Color palette

### Light mode (default)

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#FFFFFF` | Page and card background — Neutral Light |
| `surface-muted` | `#F6F5F3` | Section backgrounds, alternating rows, subtle panels (warm-neutral, not cool gray) |
| `charcoal` | `#18181A` | Header, footer, hero panels, table headers — the club's chrome color — Primary Base |
| `charcoal-light` | `#262629` | Hover state on charcoal chrome |
| `cyan` | `#0083A3` | Links, secondary interactive elements, "informational/positive" badges — Secondary Accent |
| `cyan-dark` | `#006982` | Hover state on cyan |
| `accent` | `#C8102E` | Primary CTA buttons, live match indicators, critical highlights — **the** accent color — Primary Accent (crimson) |
| `accent-dark` | `#A50D26` | Hover state on accent |
| `gold` | `#C9A227` | Used sparingly — badges, dividers, honours, the crest's trim line — Gold/Warm Accent |
| `gold-dark` | `#A88720` | Hover state on gold |
| `earth` | `#4A3524` | An alternate dark section tone, distinct from charcoal — used sparingly (e.g. heritage content) — Neutral Dark |
| `earth-light` | `#5E442F` | Hover/lighter variant of earth |
| `ink` | `#141312` | Primary text on light surfaces (warm near-black, not blue-black) |
| `muted` | `#6B655C` | Secondary/supporting text (warm gray) |
| `border` | `#E4E0D9` | Hairlines, dividers, input borders (warm-neutral) |

### Dark mode

Same token *names*, different values — components never branch on mode explicitly.

| Token | Hex | Note |
|---|---|---|
| `surface` | `#0F0E0D` | Near-black warm page background |
| `surface-muted` | `#181614` | Panel background |
| `charcoal` | `#0A0A0B` | Slightly deeper than the page background, so chrome still reads as distinct from content |
| `cyan` | `#29C4E8` | Brightened for contrast against a dark page |
| `accent` | `#E63950` | Brightened for contrast against a dark page |
| `gold` | `#D9B84A` | Brightened for contrast against a dark page |
| `earth` | `#6E4F37` | Brightened for contrast against a dark page |
| `ink` | `#F4F2EF` | Text flips to warm near-white |
| `muted` | `#A8A096` | |
| `border` | `#332E28` | |

### Usage rules

1. **One accent action per screen.** Crimson is reserved for the single most important call-to-action or state on any given view (e.g. "Buy Tickets", a genuinely live match). If everything is red, nothing is.
2. **Gold is a trim, not a fill.** Use it for badges (e.g. the FUFA Big League pill on the homepage hero), the crest's outline detail, dividers, and honours — never as a large background fill or body text color; it's the one color explicitly called out as needing restraint in the club's brief.
3. **No green.** "Positive/confirmed" states (paid, full-time, delivered) use **cyan**, not green — a deliberate deviation from typical UI convention (documented here so it isn't "fixed" back to green later).
4. **Charcoal is structural, not decorative.** It marks chrome — header, footer, table headers, dark section backgrounds — never body text color choices. **Earth** is available as an occasional alternate dark tone but should stay rare enough to feel intentional, not like a second charcoal.
5. **Text on colored backgrounds** always uses white or the palette's own darkest/lightest ink — never a fifth gray.

---

## Typography

| Role | Typeface | Weight | Usage |
|---|---|---|---|
| Display | Barlow Condensed | 600 / 700 | H1–H4, hero titles, match scores, section headers. Used sparingly — never body copy. |
| Body | Inter | 400 / 500 / 600 | Paragraphs, labels, UI text, navigation |
| Mono | IBM Plex Mono | 400 / 600 | Scores, stats, fixture times, table numerics — set with `font-variant-numeric: tabular-nums` so columns of numbers align |

**Why Barlow Condensed:** condensed sans faces are the near-universal choice among elite club sites for headlines and score displays (tall, efficient, athletic without being a novelty display face) — it reads as "sports broadcast" without tipping into gimmicky.

**Scale:** Tailwind's default type scale (`text-sm` through `text-4xl`+) is used as-is — no custom scale needed. Headings get `font-display` + `font-weight: 600` by default (set globally in `globals.css`); bump to `font-bold` only for hero-level H1s.

---

## Spacing system

Tailwind's default 4px-based scale is the system — no custom scale was introduced, to keep the codebase idiomatic. Conventions:

| Context | Spacing |
|---|---|
| Section vertical padding | `py-12` mobile → `py-16` desktop (handled by the `Section` component) |
| Card internal padding | `p-4` (compact cards: player, match) / `p-6` (content cards: news, admin panels) |
| Grid gaps | `gap-4` (dense grids like squad/gallery) / `gap-6` (content grids like news) |
| Page horizontal padding | `px-4` mobile → `px-6`/`px-8` desktop (handled by the `Container` component) |

---

## Buttons

Component: `src/components/ui/Button.tsx`

| Variant | Style | Use for |
|---|---|---|
| `primary` | Solid accent red, white text | The one primary action per view |
| `secondary` | Solid charcoal, white text | Secondary but still prominent actions ("View all fixtures") |
| `outline` | Bordered, transparent bg | Tertiary actions, cancel buttons |
| `ghost` | No border, transparent bg | Lowest-emphasis actions, icon-adjacent buttons |
| `danger` | Solid red (same as accent) | Destructive confirmations (delete, cancel order) — visually identical to primary by design, since the palette has no separate "danger color"; disambiguate with copy ("Delete", not "Confirm") |

All variants share sizing (`sm`/`md`/`lg`), a loading spinner state, and `rounded-card` corners.

---

## Cards

Base primitive: `src/components/ui/Card.tsx` (`Card`, `CardHeader`, `CardBody`, `CardFooter`) — white surface, `border-border`, `shadow-card` (a soft two-layer shadow, see `tailwind.config.ts`), `rounded-card` (14px).

Domain-specific cards compose this visual language but are their own components (not configurations of one mega-card), because their content shapes differ too much to share props cleanly:

- **`PlayerCard`** (`src/components/football/PlayerCard.tsx`) — 3:4 photo (charcoal placeholder silhouette until real photos exist), jersey number badge overlaid top-right, name + position/nationality below.
- **`MatchCard`** (`src/components/football/MatchCard.tsx`) — the single component behind both Fixtures and Results (a fixture is just a match card whose status is `SCHEDULED` instead of `FULL_TIME`). Shows competition, status badge, both teams, and either kickoff time or final score.
- **`NewsCard`** (`src/components/football/NewsCard.tsx`) — 16:9 (or 16:7 `featured`) cover image, category badge, date, title, excerpt. Featured variant spans 2 grid columns for a "lead story" layout.

All three use the shared `.hover-lift` utility (2px translate + shadow on hover) for a consistent, subtle "premium" interaction feel — never a scale/rotate effect, which reads as cheap.

---

## Forms

Components: `src/components/ui/Input.tsx` (`Input`, `Textarea`).

- Consistent 44px-tall fields (`py-2.5` + text-sm line height), `rounded-card`, `border-border`, focus ring in **cyan blue** (not red — red is reserved for actions/alerts, not neutral focus states).
- Label, hint, and error text are built into the component (not left to each call site) so every form in the app — contact form, admin CRUD, checkout, ticket purchase — has identical accessibility wiring (`aria-invalid`, `aria-describedby`).
- Error text and border always use `text-danger` / `border-danger` (red) — the one place red appears outside of CTAs/live states, since form errors are genuinely urgent.

---

## Tables

Primitives: `src/components/ui/Table.tsx` (`Table`, `Thead`, `Th`, `Tbody`, `Tr`, `Td`).

- Header row: solid **charcoal** background, white uppercase text — gives every data table (league table, admin order list, ticket list) the same "official record" feel.
- Body rows: white background, hairline dividers, subtle `surface-muted` hover.
- Horizontal scroll wrapper built in, so dense tables (league table with 8 columns) don't break mobile layouts — non-critical columns (`W`/`D`/`L`) hide below `sm`, critical ones (`P`, `Pts`) never hide.

### League Table specifically

`src/components/football/LeagueTable.tsx` highlights Volcanoes FC's own row with a subtle cyan-blue tint and accent-red team name — the one place a table row gets a color treatment, so the club's position is always scannable at a glance in a full league table.

---

## Navigation

`src/components/layout/Navbar.tsx` — solid charcoal header with a **2px red bottom border** (a small but deliberate premium signature, echoing the "trim line" many elite club sites use under their nav). Desktop: click-to-open dropdowns for grouped sections (Club, Team, Fixtures & Results, Gallery). Mobile: full accordion menu. Renders entirely from `src/config/navigation.ts` — no hardcoded links.

Admin sidebar (`AdminSidebar.tsx`) intentionally does **not** use charcoal chrome — it uses the neutral `surface-muted` background, so staff tools read as a calm workspace rather than a marketing surface wearing the same "away kit" as the public nav.

---

## Footer

`src/components/layout/Footer.tsx` — same charcoal chrome as the header, four-column layout (brand blurb, quick links, contact, social), bottom bar with copyright + staff login link. Placeholder fields (`⚠️`) render as visible "pending club input" text rather than empty space, so gaps in real content are obvious to anyone reviewing the live site pre-launch.

---

## Player cards, match cards, news cards, fixtures/results, league table

Covered above under **Cards** and **Tables** — repeated here only to confirm explicit coverage of every category requested: all five have working components today (`src/components/football/`), built with placeholder/mock data props, ready to receive real data in Phase 2–3.

---

## Admin dashboard components

The admin surface intentionally under-styles relative to the public site — same design tokens (color, spacing, radius), quieter chrome:

- `AdminSidebar` — flat `surface-muted` background, sections rendered from `ADMIN_NAV`, active/hover states use plain `surface` (no charcoal/red — those are public-site-only accents so staff tools don't visually compete with the content they manage).
- `StatCard` (`src/components/admin/StatCard.tsx`) — the dashboard KPI tile (unread messages, upcoming fixtures, pending orders). Same quiet chrome as the sidebar; a `trend` indicator uses cyan blue for "up" and accent red for "down" — again, no green/amber. Shown live on `/admin` with honest `—` placeholder values until each module has real data to report.
- Tables (`Table` primitives) are reused as-is for admin lists (orders, tickets, users) — one table language for the whole app.
- Buttons: `primary` (red) still means "the one important action" in admin context too — e.g. "Publish" on a news article, "Save" on a settings form — never used for routine navigation.

---

## Mobile responsiveness

Mobile-first throughout — every component's *unprefixed* Tailwind classes are the mobile layout; `sm:`/`md:`/`lg:` breakpoints add desktop enhancement, never the reverse.

- **Navbar**: hamburger + accordion below `lg`, full dropdown nav at `lg`+.
- **League Table**: `W`/`D`/`L` columns hidden below `sm`, `GD` hidden below `md` — `P` and `Pts` always visible as the two numbers that matter most on a small screen.
- **News grid**: single column on mobile, up to 3 on desktop; `featured` card spans full width on mobile, 2 columns on `sm`+.
- **Squad grid**: 2 columns on mobile, up to 4–5 on desktop.
- **Forms**: full-width fields on mobile; fields only sit side-by-side (e.g. a future checkout name/email row) at `sm`+ via a parent grid — never inside the `Input` component itself, keeping it composable.

---

## Dark / light mode

- Implemented via a `.dark` class on `<html>`, toggled by `ThemeToggle` (`src/components/layout/ThemeToggle.tsx`) and persisted to `localStorage`.
- An inline script in `src/app/layout.tsx` applies the saved preference (or OS preference, if never set explicitly) before first paint, avoiding a flash of the wrong theme.
- **Token names never change between modes** — only their CSS variable values do (`:root` vs `.dark` blocks in `globals.css`). This means components should almost never need a `dark:`-prefixed class; if you find yourself reaching for one, first check whether the *token* should simply have a different dark-mode value instead.
- Charcoal chrome (nav/footer) stays visually "chrome-like" in both modes by design — in dark mode it's *lighter* than the page background (rather than blending into it), preserving the same structural read as light mode.

---

## Icon system

Library: **lucide-react** (already a dependency).

- Stroke width: default (2px) for all UI icons — no custom stroke overrides, for visual consistency.
- Sizing scale: `h-4 w-4` (16px, inline with text), `h-5 w-5` (20px, buttons/nav), `h-6 w-6` (24px, standalone/mobile toggles). Never smaller than 16px (illegible) or larger than 24px outside of empty-state illustrations.
- Color: icons inherit `currentColor` — they take on charcoal/ink/white/accent from their context rather than being hardcoded, so an icon inside a red button is white and the same icon in a nav link is charcoal/white automatically.
- Decorative icons get `aria-hidden`; icon-only interactive elements (like `ThemeToggle`) always get an explicit `aria-label`.

---

## Animation & transitions

Tokens (`globals.css`): `--duration-fast` (120ms), `--duration-base` (200ms), `--duration-slow` (320ms), `--ease-standard` (a standard Material-style ease curve).

| Interaction | Treatment |
|---|---|
| Hover on cards (player/news) | `.hover-lift` utility — 2px upward translate + shadow, 200ms |
| Button/link hover | Background color transition, 150–200ms, no scale/transform |
| Theme toggle | Background-color transition on `<body>` (200ms) so the mode switch doesn't feel like a jump cut |
| Live match indicator | `.animate-pulse-dot` — a slow (1.4s) opacity pulse on a small dot, reserved for genuinely live states, never more than one instance per view |
| Page/section entrance | `animate-fade-in` utility (subtle translate + fade, 300ms) — used sparingly for hero/section reveals, not on every element |
| Reduced motion | Respected globally — `prefers-reduced-motion: reduce` collapses all durations to near-zero (`globals.css` base layer) |

**Principle:** motion should feel *confident and understated*, matching elite club sites — never bouncy, never attention-seeking. If an animation calls attention to itself rather than to the content, it's cut.

---

## What changed from the Phase 0 placeholder identity

For traceability: the original "floodlit pitch + tiger amber" placeholder (amber/gold/green) is fully retired. Every reference was swept from the codebase (`globals.css`, `tailwind.config.ts`, all components) and replaced with the tokens above. `LogoMark` was redrawn in charcoal/red/white. Display typeface changed from Anton to Barlow Condensed. Nothing from the old identity remains except the *structure* (CSS-variable-driven tokens, `.dark` class strategy) — which was built to be swappable exactly for this reason.

## What changed for the Volcanoes FC rebrand

The club rebranded from Mukono Tigers SC to **Volcanoes FC**, competing in the **FUFA Big League** (Uganda's second tier). Same structural approach as the previous rebrand proved out: only token *values* changed (`globals.css`), plus two new tokens (`gold`, `earth`) added for brand roles the old identity didn't have. Two token *names* were renamed, not just recolored, because their meaning genuinely changed: `navy` → `charcoal` (the primary base stopped being a blue at all) and `royal` → `cyan` (the old "royal blue" name no longer fit a bright cyan). `LogoMark`'s monogram changed from "MT" to "VFC," with a new thin gold trim line — the identity's one deliberately restrained use of the warm accent. No motto, crest, address, or other unconfirmed club fact was invented in the process — see `docs/CLUB_INFO_NEEDED.md` for what's still outstanding.

