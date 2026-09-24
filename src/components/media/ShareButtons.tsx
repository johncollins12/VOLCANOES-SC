'use client';

import { Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { IconButton, iconButtonVariants, ICON_SIZE_CLASSES } from '@/components/ui/IconButton';
import { useToast } from '@/components/feedback/Toast';

interface ShareButtonsProps {
  url: string;
  title: string;
}

/**
 * Social share row for news articles and match reports. Uses plain share-
 * intent URLs (no SDK/pixel from any platform) and the browser Clipboard
 * API for "copy link" — no third-party script loaded just to share a URL.
 *
 * The three outbound links use `iconButtonVariants()` (IconButton.tsx) on
 * a real <a> rather than IconButton itself, since IconButton always
 * renders a <button> — nesting one inside/as a link is invalid HTML.
 * "Copy link" has no navigation, so it's the one real IconButton here.
 */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const { toast } = useToast();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const linkClass = iconButtonVariants({ variant: 'outline', size: 'sm' });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', variant: 'success' });
    } catch {
      toast({ title: 'Could not copy link', variant: 'error' });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on Facebook"
      >
        <Facebook className={ICON_SIZE_CLASSES.sm} aria-hidden />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on X (Twitter)"
      >
        <Twitter className={ICON_SIZE_CLASSES.sm} aria-hidden />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className={ICON_SIZE_CLASSES.sm} aria-hidden />
      </a>
      <IconButton icon={LinkIcon} aria-label="Copy link" variant="outline" size="sm" onClick={copyLink} />
    </div>
  );
}
