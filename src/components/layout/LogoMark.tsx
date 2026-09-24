import Image from 'next/image';
import { SITE_CONFIG } from '@/config/site';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span className={`relative block ${className}`}>
      <Image
        src="/logo.png"
        alt={`${SITE_CONFIG.shortName} crest`}
        fill
        className="object-contain"
        sizes="80px"
      />
    </span>
  );
}