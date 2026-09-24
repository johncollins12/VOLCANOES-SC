import Image from 'next/image';
import { PlayCircle } from 'lucide-react';

interface VideoEmbedProps {
  provider: string;
  externalUrl: string | null;
  storagePath: string | null;
  thumbnailUrl: string | null;
  title: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^&]+)/, /youtube\.com\/embed\/([^?&]+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Responsive video embed. The schema's VideoEntry.provider field is a
 * free-text string with three documented intended values (YOUTUBE, VIMEO,
 * SUPABASE_STORAGE — see prisma/schema.prisma) but only YOUTUBE has a
 * working embed here:
 *
 * - YOUTUBE: renders a real responsive iframe embed (id parsed from the
 *   stored URL — handles youtu.be, watch?v=, and /embed/ formats).
 * - VIMEO: NOT YET IMPLEMENTED. No Vimeo embeds have been built or tested
 *   — rather than guess at Vimeo's embed URL format, this falls back to a
 *   thumbnail + "Watch on Vimeo" outbound link, same as an unrecognized
 *   provider would.
 * - SUPABASE_STORAGE: NOT YET IMPLEMENTED. Native <video> playback from a
 *   Storage-hosted file needs the storage helpers
 *   (src/lib/supabase/storage.ts) to resolve `storagePath` to a signed/
 *   public URL server-side before this component ever sees a playable
 *   src — that plumbing doesn't exist yet, so this also falls back.
 */
export function VideoEmbed({ provider, externalUrl, storagePath, thumbnailUrl, title }: VideoEmbedProps) {
  if (provider === 'YOUTUBE' && externalUrl) {
    const videoId = extractYouTubeId(externalUrl);
    if (videoId) {
      return (
        <div className="relative aspect-video overflow-hidden rounded-card bg-charcoal">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }
  }

  // Fallback for VIMEO, SUPABASE_STORAGE, or an unparseable YouTube URL.
  return (
    <a
      href={externalUrl ?? storagePath ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex aspect-video items-center justify-center overflow-hidden rounded-card bg-charcoal"
    >
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt="" fill className="object-cover opacity-70" sizes="(min-width: 1024px) 50vw, 100vw" />
      ) : null}
      <PlayCircle className="relative h-14 w-14 text-white" aria-hidden />
      <span className="sr-only">Watch: {title}</span>
    </a>
  );
}
