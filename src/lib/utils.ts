import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely (later classes override earlier
 * conflicting ones) while still supporting conditional class objects/arrays
 * from clsx. Use this in every component instead of raw template strings.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Turns "SC Volcanoes" into "volcanoes-fc" — used for news article
 * slugs, product slugs, etc. Kept pure/deterministic so it can run both
 * client- and server-side.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Formats a Date for public display, e.g. "12 Jul 2026".
 * Centralized so date formatting stays consistent across fixtures, news,
 * and match reports without every component reaching for its own format string.
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a Date as a kickoff time, e.g. "15:00".
 */
export function formatKickoffTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

/**
 * Truncates text to a max length for card previews (news excerpts, bios),
 * breaking on a word boundary rather than mid-word.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  return truncated.slice(0, truncated.lastIndexOf(' ')) + '…';
}
