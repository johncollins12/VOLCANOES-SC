# Admin User Guide

A practical guide for club staff using the `/admin` dashboard. For technical setup, see `docs/DEPLOYMENT.md`.

## First login

There's no public sign-up — accounts are created by a `SUPER_ADMIN`, either from `/admin/users` or, for the very first account (before any admin exists to create one), directly in Supabase:

1. In the Supabase dashboard, go to **Authentication → Users → Add user** and create the first staff member's account.
2. In the database (Prisma Studio, `npm run prisma:studio`, or the Supabase SQL editor), create a matching `User` row with the **same `id`** as the Supabase Auth user, and a `UserRole` row linking it to the `SUPER_ADMIN` role.
3. That person can now sign in at `/admin/login` and create every other staff account from `/admin/users` — no more manual database work needed after this.

## Roles, at a glance

| Role | Can manage |
|---|---|
| `SUPER_ADMIN` | Everything, including Users & Roles and Settings |
| `CONTENT_EDITOR` | News, Match Reports, Players, Staff, Club Profile |
| `MATCHDAY_EDITOR` | Fixtures, Results, League Table |
| `MEDIA_MANAGER` | Gallery, Videos |
| `VIEWER` | Read-only |

A `SUPER_ADMIN` can hold any combination of roles at once (assign multiple checkboxes when creating/editing a staff account).

## Publishing content

News articles, match reports, and videos all follow the same **draft → publish** pattern: creating one starts it as a draft (not visible on the public site), and you publish it explicitly from the list view (an eye icon) or the edit form. Unpublishing is the same toggle in reverse — it's not a delete, the content just stops showing publicly.

## Module-by-module

- **News** (`/admin/news`) — Create/edit articles with the rich text editor, a featured image, and a category. Search and filter by status/category. Publishing sets the article live at `/news/[slug]`.
- **Fixtures** (`/admin/fixtures`) — One form handles both upcoming fixtures and results: enter the scoreline and set status to "Full Time" once the match is played, and it automatically becomes a result on the public site — no separate "results" form.
- **Match Reports** — Write a report against any completed fixture, with optional match statistics (possession, shots, etc.) — these only display publicly when you've actually entered numbers for them.
- **Players** (`/admin/players`) — Full squad management: bio details, position, jersey number, photo, and season statistics (including goalkeeper-specific stats — clean sheets, saves, save %, penalties saved — which only appear for players assigned a Goalkeeper position).
- **Staff** (`/admin/staff`) — Management, Technical, Medical, and Administration staff in one list, grouped by category. Display Order controls how they're sorted within their category on the public Management/Technical Staff pages.
- **Sponsors** (`/admin/sponsors`) — Logo, website link, tier, and Display Order (controls position within a tier on the public `/sponsors` page and homepage strip).
- **Gallery** (`/admin/gallery`) — Create an album, then upload photos to it with optional captions on the album's edit page.
- **Videos** (`/admin/videos`) — Add a YouTube URL and thumbnail; mark as Featured to highlight it. Only YouTube actually plays on the public site today (see the root README's Known Limitations).
- **Media Library** (`/admin/media`) — Browse every file already uploaded across the site, organized by storage bucket. Useful for finding/reusing an image, or cleaning up unused files — but deleting a file here doesn't check whether a page still displays it (see the README).
- **Messages** (`/admin/messages`) — Contact form submissions. Opening one marks it read automatically.
- **Newsletter** (`/admin/newsletter`) — See and search subscribers, unsubscribe or delete individuals, and export every active subscriber's email as a CSV.
- **Settings** (`/admin/settings`) — Club name, founding year, history/vision/mission text, contact details, social links, and SEO defaults. This is the single most important place to fill in with real club information — see `docs/CLUB_INFO_NEEDED.md`.
- **Users** (`/admin/users`) — Create staff accounts (sends a Supabase invite email to set a password), assign roles, and activate/deactivate accounts. You cannot deactivate or delete your own account.
- **Activity Log** (`/admin/activity-log`) — Not yet implemented; the page explains exactly what would need to be built (see the README's Known Limitations).

## Troubleshooting

- **"Forbidden" error after clicking an action** — your account doesn't have the role required for that action. Ask a `SUPER_ADMIN` to check your roles at `/admin/users`.
- **New staff member says they never got an invite email** — check Supabase's Auth logs (Authentication → Logs) for delivery issues, and check spam. Supabase's default email sending has rate limits on the free tier; a custom SMTP provider can be configured in Supabase's Auth settings if invites need to be more reliable.
- **Uploaded image doesn't show up** — confirm the relevant Storage bucket exists in Supabase and is set to public read (see `docs/DEPLOYMENT.md` §1).
