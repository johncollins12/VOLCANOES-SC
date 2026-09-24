# Testing

## What's covered today

Unit tests for pure logic — the highest-value, cheapest-to-maintain tests, requiring no database, browser, or network:

| File | Covers |
|---|---|
| `src/lib/utils.test.ts` | `slugify`, `truncateText`, `formatDisplayDate`, `cn` |
| `src/lib/pagination.test.ts` | `resolvePagination` (clamping, defaults), `toPaginatedResult` |
| `src/lib/sanitize.test.ts` | `sanitizeRichText` — the XSS-prevention sanitizer applied to every admin-authored article/report body. Verifies `<script>`, event-handler attributes, and `javascript:` URLs are stripped, and that legitimate formatting (headings, bold, lists, links) survives. |

Run them:

```bash
npm test              # single run
npx vitest             # watch mode
```

22 tests, all passing as of this phase.

## What's intentionally not covered, and why

- **Component tests** (rendering `Button`, `Modal`, `DataTable`, etc. in a simulated DOM) would need `@testing-library/react` + a `jsdom` environment added as devDependencies. Not added in this pass to avoid introducing dependencies beyond what the current test suite actually needs — `vitest.config.ts` documents this and is ready to extend (add `environment: 'jsdom'` to a second project, or a `test.environmentMatchGlobs` entry for `*.component.test.tsx`).
- **Integration tests against a real database** would need a test Postgres instance (or Supabase's local dev stack) wired into CI — meaningful to add once real CI infrastructure exists, but not something a repository alone can provide.
- **End-to-end tests** (Playwright/Cypress driving a real browser against a running instance) are the right tool for verifying full user flows (sign in → create a fixture → see it on the public site) but need a deployed or locally-running instance to drive, which this environment can't provide.
- **Cross-browser, tablet, and desktop responsiveness** were verified through code review (every layout uses Tailwind's responsive prefixes consistently — `sm:`/`lg:` breakpoints throughout — and the design system's spacing/breakpoint rules are documented in `DESIGN_SYSTEM.md`) rather than automated visual regression testing, which needs real browser rendering this sandbox doesn't have.

## Manual QA checklist

Use this before every release, alongside the automated suite:

- [ ] Sign in as each role (`SUPER_ADMIN`, `CONTENT_EDITOR`, `MATCHDAY_EDITOR`, `MEDIA_MANAGER`) and confirm each can only reach what they should
- [ ] Create → edit → delete one record in each admin module (News, Fixtures, Players, Staff, Sponsors, Gallery, Videos)
- [ ] Submit the public contact form; confirm it appears (and can be marked read/deleted) at `/admin/messages`
- [ ] Subscribe via the homepage newsletter form; confirm it appears at `/admin/newsletter` and exports via CSV
- [ ] Resize the browser through mobile (375px) → tablet (768px) → desktop (1440px) on: homepage, a news article, the admin dashboard, and one admin form
- [ ] Tab through a form using only the keyboard; confirm focus is always visible and in a sensible order
- [ ] Open the gallery lightbox and the video modal; confirm Escape closes them and focus returns to the trigger
- [ ] Test in at least two browser engines (e.g. Chrome/Blink and Safari/WebKit, or Firefox/Gecko)
