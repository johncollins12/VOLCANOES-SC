import { Tabs } from '@/components/cms/Tabs';
import { listMediaFiles, getMediaBuckets } from '@/lib/data';
import { MediaFileGrid } from './MediaFileGrid';

/**
 * /admin/media — a real file browser over Supabase Storage buckets, not a
 * database-backed asset catalog (see listMediaFiles' comment on why no
 * such model exists). All buckets are fetched up front since this is an
 * admin-only, low-traffic page — acceptable to trade a slightly heavier
 * initial load for Tabs' simplicity (its `content` prop needs already-
 * resolved JSX per tab, not a lazy fetch-on-select).
 */
export default async function MediaLibraryPage() {
  const buckets = getMediaBuckets();
  const filesByBucket = await Promise.all(buckets.map((b) => listMediaFiles(b.bucket)));

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl text-ink">Media Library</h1>
      <p className="mb-6 text-sm text-muted">
        Files uploaded from other admin forms (player photos, sponsor logos, gallery images, etc.), organized by
        storage bucket.
      </p>

      <Tabs
        tabs={buckets.map((b, i) => ({
          key: b.key,
          label: b.label,
          content: <MediaFileGrid bucket={b.bucket} files={filesByBucket[i] ?? []} />,
        }))}
      />
    </div>
  );
}
