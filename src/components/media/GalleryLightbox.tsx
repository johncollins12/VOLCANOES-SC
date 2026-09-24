'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryCard } from '@/components/football/GalleryCard';
import { Modal } from '@/components/feedback/Modal';
import { IconButton } from '@/components/ui/IconButton';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

/**
 * Photo grid + lightbox viewer for an album, built entirely from existing
 * components: GalleryCard for thumbnails (built in the UI Component
 * Library phase) and Modal for the full-size viewer (feedback module) —
 * the only new code is the "which index is open" state and the prev/next
 * navigation between images, which didn't exist anywhere to reuse.
 *
 * Lazy loading & image optimization: every image (grid thumbnails and the
 * lightbox's full view) goes through next/image, which lazy-loads
 * off-screen images and serves responsively-sized, optimized output by
 * default — no separate lazy-loading library needed.
 */
export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = openIndex !== null ? images[openIndex] : null;

  function showPrevious() {
    if (openIndex === null) return;
    setOpenIndex(openIndex === 0 ? images.length - 1 : openIndex - 1);
  }

  function showNext() {
    if (openIndex === null) return;
    setOpenIndex(openIndex === images.length - 1 ? 0 : openIndex + 1);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <GalleryCard
            key={image.id}
            imageUrl={image.imageUrl}
            caption={image.caption}
            onClick={() => setOpenIndex(index)}
          />
        ))}
      </div>

      <Modal
        isOpen={current !== null}
        onClose={() => setOpenIndex(null)}
        title={current?.caption || 'Photo'}
        hideTitle
        size="lg"
      >
        {current && (
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-charcoal">
              <Image src={current.imageUrl} alt={current.caption ?? ''} fill className="object-contain" sizes="90vw" />
            </div>
            {current.caption && <p className="mt-3 text-center text-sm text-muted">{current.caption}</p>}

            {images.length > 1 && (
              <div className="mt-3 flex items-center justify-between">
                <IconButton icon={ChevronLeft} aria-label="Previous photo" variant="outline" onClick={showPrevious} />
                <span className="text-xs text-muted">
                  {(openIndex ?? 0) + 1} / {images.length}
                </span>
                <IconButton icon={ChevronRight} aria-label="Next photo" variant="outline" onClick={showNext} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
