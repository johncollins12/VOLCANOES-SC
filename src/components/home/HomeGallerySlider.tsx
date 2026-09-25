'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImageForSlider } from '@/lib/data/gallery';

const AUTO_ADVANCE_MS = 5000;

interface HomeGallerySliderProps {
  images: GalleryImageForSlider[];
}

export function HomeGallerySlider({ images }: HomeGallerySliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [index, isPaused, images.length, goTo]);

  if (images.length === 0) return null;

  const current = images[index];
  if (!current) return null;

  return (
    <section
      aria-label="Club photos"
      className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-charcoal sm:h-[60vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {images.map((image, i) => (
        <div key={image.id} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== index}>
          <Image
            src={image.imageUrl}
            alt={image.caption ?? `Photo from ${image.albumTitle}`}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" aria-hidden />

      {(current.caption || current.albumTitle) && (
        <div className="absolute bottom-4 left-4 right-16 text-sm text-white sm:bottom-6 sm:left-6">
          <Link href={`/gallery/${current.albumId}`} className="hover:underline">
            {current.caption ?? current.albumTitle}
          </Link>
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-charcoal/50 p-2 text-white transition hover:bg-charcoal/80 sm:left-4"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-charcoal/50 p-2 text-white transition hover:bg-charcoal/80 sm:right-4"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          <div className="absolute bottom-4 right-4 flex gap-1.5 sm:bottom-6 sm:right-6">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}