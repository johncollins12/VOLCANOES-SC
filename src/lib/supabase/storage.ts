import { createSupabaseServerClient } from './server';

/**
 * Storage buckets used across the platform.
 * Created once during Supabase project setup (Phase 0 infra task, not code).
 * Keeping names centralized here avoids typos scattered across features.
 */
export const STORAGE_BUCKETS = {
  clubAssets: 'club-assets', // crest, brand assets
  playerPhotos: 'player-photos',
  staffPhotos: 'staff-photos',
  gallery: 'gallery',
  videoThumbnails: 'video-thumbnails',
  news: 'news-images',
  sponsors: 'sponsor-logos',
  shopProducts: 'shop-products',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Uploads a file to a given bucket and returns its public URL.
 * Assumes the bucket is configured as public-read; for private buckets
 * (e.g. ticket QR codes), use `createSignedUrl` instead.
 */
export async function uploadPublicFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob
): Promise<{ publicUrl: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}

/**
 * Generates a time-limited signed URL for a private object
 * (e.g. an order invoice or a ticket QR code).
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 60 * 10
): Promise<{ signedUrl: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error || !data) {
    return { error: error?.message ?? 'Failed to create signed URL' };
  }

  return { signedUrl: data.signedUrl };
}
