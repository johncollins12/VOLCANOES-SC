'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms/Select';
import { SearchBox } from '@/components/forms/SearchBox';
import type { NewsCategoryOption } from '@/lib/data/news';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

/** Admin-only filter bar for /admin/news — adds a status filter on top of the public NewsFilters' category+search, since drafts/archived only matter to staff. */
export function AdminNewsFilters({ categories }: { categories: NewsCategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="w-full sm:max-w-xs">
        <SearchBox
          id="admin-news-search"
          label="Search"
          placeholder="Search articles…"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(value) => updateParam('q', value)}
        />
      </div>
      <Select
        id="admin-news-status"
        label="Status"
        value={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
        placeholder="All statuses"
        options={STATUS_OPTIONS}
        className="sm:max-w-[160px]"
      />
      {categories.length > 1 && (
        <Select
          id="admin-news-category"
          label="Category"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          className="sm:max-w-[180px]"
        />
      )}
    </div>
  );
}
