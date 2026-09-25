'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { GalleryImageForSlider } from '@/lib/data/gallery';

const AUTO_ADVANCE_MS = 6000;

export function HeroBackgroundSlideshow({ images }: { images: GalleryImageForSlider[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((image, i) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <Image src={image.imageUrl} alt="" fill priority={i === 0} className="object-cover" sizes="100vw" />
        </div>
      ))}
    </>
  );
}