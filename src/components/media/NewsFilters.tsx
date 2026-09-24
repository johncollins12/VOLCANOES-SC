'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms/Select';
import { SearchBox } from '@/components/forms/SearchBox';
import type { NewsCategoryOption } from '@/lib/data/news';

interface NewsFiltersProps {
  categories: NewsCategoryOption[];
}

/**
 * Category + search controls for /news, both URL-driven (?category=<id>,
 * ?q=<term>) so a filtered/searched view is shareable and back-button-safe
 * — same pattern as CompetitionFilter (Football Module phase). Kept as
 * one component (rather than two, mirroring that one) since News always
 * shows both controls together, side by side, unlike the fixtures/results/
 * table pages which only ever needed the single competition filter.
 */
export function NewsFilters({ categories }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      {categories.length > 1 && (
        <Select
          id="news-category-filter"
          label="Category"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          className="sm:max-w-xs"
        />
      )}
      <div className="w-full sm:max-w-xs">
        <SearchBox
          id="news-search"
          label="Search news"
          placeholder="Search articles…"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(value) => updateParam('q', value)}
        />
      </div>
    </div>
  );
}
