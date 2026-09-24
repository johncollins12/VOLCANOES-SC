import { describe, it, expect } from 'vitest';
import { slugify, truncateText, formatDisplayDate, cn } from './utils';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Volcanoes FC')).toBe('volcanoes-fc');
  });

  it('strips punctuation', () => {
    expect(slugify("John O'Brien, Jr.")).toBe('john-obrien-jr');
  });

  it('collapses repeated whitespace and hyphens', () => {
    expect(slugify('  Too   Many   Spaces  ')).toBe('too-many-spaces');
  });
});

describe('truncateText', () => {
  it('returns the original string when under the limit', () => {
    expect(truncateText('short', 20)).toBe('short');
  });

  it('truncates on a word boundary, not mid-word', () => {
    const result = truncateText('The quick brown fox jumps', 12);
    // 'The quick brown' sliced at 12 chars mid-word would be 'The quick br';
    // truncateText should back up to the last full word instead.
    expect(result).toBe('The quick…');
  });
});

describe('formatDisplayDate', () => {
  it('formats a Date as "DD Mon YYYY"', () => {
    expect(formatDisplayDate(new Date('2026-03-05T12:00:00Z'))).toBe('05 Mar 2026');
  });

  it('accepts an ISO string as well as a Date', () => {
    expect(formatDisplayDate('2026-03-05T12:00:00Z')).toBe('05 Mar 2026');
  });
});

describe('cn', () => {
  it('merges conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
});
