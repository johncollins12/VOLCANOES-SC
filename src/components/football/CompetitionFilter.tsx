'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms/Select';
import type { CompetitionOption } from '@/lib/data/competitions';

interface CompetitionFilterProps {
  competitions: CompetitionOption[];
  /** Search-param key this filter reads/writes, e.g. "competition". */
  paramName?: string;
}

/**
 * URL-driven competition filter shared by the Fixtures, Results, and
 * League Table pages — one component instead of three near-duplicates.
 * State lives in the URL (?competition=<id>), not client state, so a
 * filtered view is a real shareable/bookmarkable/back-button-safe link,
 * and the page's Server Component can read `searchParams` directly rather
 * than needing a client-side data fetch.
 *
 * Renders nothing if there's only one (or zero) competitions to choose
 * from — a filter with a single option isn't a filter.
 */
export function CompetitionFilter({ competitions, paramName = 'competition' }: CompetitionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) ?? '';

  if (competitions.length <= 1) return null;

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    params.delete('page'); // changing the filter invalidates whatever page we were on
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return (
    <Select
      id="competition-filter"
      label="Competition"
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="All competitions"
      options={competitions.map((c) => ({ value: c.id, label: c.name }))}
      className="max-w-xs"
    />
  );
}
