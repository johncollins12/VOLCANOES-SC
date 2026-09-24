import { createSupabaseServerClient } from '@/lib/supabase/server';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/supabase/storage';

export interface MediaFile {
  name: string;
  publicUrl: string;
  sizeBytes: number | null;
  updatedAt: string | null;
}

/**
 * "Media Library" here means a real file browser over Supabase Storage
 * buckets — NOT a database table. There is no general-purpose Asset/Media
 * model in the schema (every image is just a URL string on whichever
 * entity owns it — NewsArticle.coverImageUrl, Player.photoUrl, etc.), and
 * inventing one now would mean two untracked sources of truth (the real
 * files in Storage vs. fabricated DB rows) that could drift apart. This
 * lists what's actually in each bucket, which is always accurate by
 * construction.
 *
 * Returns an empty array — never fabricated file entries — if the bucket
 * is empty or the Storage API call fails (e.g. Supabase not yet
 * configured in this environment).
 */
export async function listMediaFiles(bucket: StorageBucket): Promise<MediaFile[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error || !data) {
      if (error) console.error('[listMediaFiles] Storage API error:', error.message);
      return [];
    }

    return data
      .filter((f) => f.id !== null) // Supabase Storage returns folder placeholders with id: null
      .map((f) => ({
        name: f.name,
        publicUrl: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
        sizeBytes: (f.metadata?.size as number | undefined) ?? null,
        updatedAt: f.updated_at ?? null,
      }));
  } catch (error) {
    console.error('[listMediaFiles] failed to list files:', error);
    return [];
  }
}

/** Every configured bucket, for the library's tab list. */
export function getMediaBuckets(): { key: string; bucket: StorageBucket; label: string }[] {
  return [
    { key: 'club', bucket: STORAGE_BUCKETS.clubAssets, label: 'Club Assets' },
    { key: 'players', bucket: STORAGE_BUCKETS.playerPhotos, label: 'Player Photos' },
    { key: 'staff', bucket: STORAGE_BUCKETS.staffPhotos, label: 'Staff Photos' },
    { key: 'gallery', bucket: STORAGE_BUCKETS.gallery, label: 'Gallery' },
    { key: 'video-thumbs', bucket: STORAGE_BUCKETS.videoThumbnails, label: 'Video Thumbnails' },
    { key: 'news', bucket: STORAGE_BUCKETS.news, label: 'News Images' },
    { key: 'sponsors', bucket: STORAGE_BUCKETS.sponsors, label: 'Sponsor Logos' },
    { key: 'shop', bucket: STORAGE_BUCKETS.shopProducts, label: 'Shop Products' },
  ];
}
