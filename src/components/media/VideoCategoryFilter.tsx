'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms/Select';
import type { VideoCategoryOption } from '@/lib/data/videos';

interface VideoCategoryFilterProps {
  categories: VideoCategoryOption[];
}

/**
 * Category filter for /videos, URL-driven (?category=<id>) — same pattern
 * as CompetitionFilter and NewsFilters. Kept as its own component (rather
 * than reusing NewsFilters directly) since the Video Centre has no search
 * box, only a category filter; NewsFilters always renders both controls.
 */
export function VideoCategoryFilter({ categories }: VideoCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (categories.length <= 1) return null;

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.delete('page');
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return (
    <Select
      id="video-category-filter"
      label="Category"
      value={searchParams.get('category') ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="All categories"
      options={categories.map((c) => ({ value: c.id, label: c.name }))}
      className="max-w-xs"
    />
  );
}
