'use client';

import { useState } from 'react';
import { VideoCard } from './VideoCard';
import { VideoEmbed } from './VideoEmbed';
import { Modal } from '@/components/feedback/Modal';

interface VideoItem {
  id: string;
  title: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | string | null;
  provider: string;
  externalUrl: string | null;
  storagePath: string | null;
}

/**
 * Video grid + "play in place" modal for the Video Centre — the same
 * pattern as GalleryLightbox (grid of teasers + Modal for the expanded
 * view), reused here rather than re-invented, since opening a video
 * shouldn't navigate to a separate page any more than opening a photo
 * should.
 */
export function VideoLightbox({ videos }: { videos: VideoItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const current = videos.find((v) => v.id === openId) ?? null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            categoryName={video.categoryName}
            thumbnailUrl={video.thumbnailUrl}
            publishedAt={video.publishedAt}
            onClick={() => setOpenId(video.id)}
          />
        ))}
      </div>

      <Modal isOpen={current !== null} onClose={() => setOpenId(null)} title={current?.title ?? 'Video'} size="lg">
        {current && (
          <VideoEmbed
            provider={current.provider}
            externalUrl={current.externalUrl}
            storagePath={current.storagePath}
            thumbnailUrl={current.thumbnailUrl}
            title={current.title}
          />
        )}
      </Modal>
    </>
  );
}
