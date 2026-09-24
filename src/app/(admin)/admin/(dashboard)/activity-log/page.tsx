import { AlertTriangle } from 'lucide-react';

/**
 * /admin/activity-log — SCHEMA LIMITATION, documented rather than
 * fabricated: there is no AuditLog (or similarly named) model in
 * prisma/schema.prisma. No admin action anywhere in this codebase
 * (news, fixtures, players, staff, sponsors, gallery, videos, users,
 * settings) currently writes to an activity trail, because there's
 * nowhere for it to write to.
 *
 * This page exists to make that limitation visible to staff who click
 * the nav item, rather than the link 404ing or silently showing an empty
 * table that looks like "nothing has happened yet" instead of "this
 * isn't built yet."
 *
 * To implement for real:
 * 1. Add a model, e.g.:
 *      model ActivityLogEntry {
 *        id         String   @id @default(uuid())
 *        actorId    String
 *        actor      User     @relation(fields: [actorId], references: [id])
 *        action     String   // "create" | "update" | "delete" | "publish" | "unpublish"
 *        entityType String   // "NewsArticle" | "Fixture" | "Player" | ...
 *        entityId   String
 *        entityLabel String  // denormalized display name, since the entity may later be deleted
 *        createdAt  DateTime @default(now())
 *      }
 * 2. Write to it from inside each Server Action (after the real mutation
 *    succeeds) — every actions/*.actions.ts file in this codebase is the
 *    call site list.
 * 3. Add getRecentActivity()/getActivityLog() to a new
 *    src/lib/data/activity-log.ts, and build this page as a real
 *    DataTable of entries, the same pattern as every other admin list.
 */
export default function ActivityLogPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Activity Log</h1>

      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-muted" aria-hidden />
        <p className="font-display text-lg text-ink">Not yet implemented</p>
        <p className="max-w-md text-sm text-muted">
          There is no activity/audit log model in the database yet, so no admin actions are currently being recorded.
          This page is a placeholder documenting that limitation rather than showing fabricated entries — see this
          file&rsquo;s source comment for exactly what adding real activity logging would require.
        </p>
      </div>
    </div>
  );
}
