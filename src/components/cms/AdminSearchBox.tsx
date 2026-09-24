'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/forms/SearchBox';

interface AdminSearchBoxProps {
  placeholder?: string;
  paramName?: string;
}

/**
 * URL-driven search box (?q=<term>) for admin list pages that only need a
 * plain search — no category/status filters alongside it (those pages,
 * like /admin/news, compose their own filter bar instead — see
 * AdminNewsFilters — since they need more than one control). Extracted
 * here once several modules (players, staff, sponsors, messages,
 * newsletter) needed this exact "search only" case.
 */
export function AdminSearchBox({ placeholder = 'Search…', paramName = 'q' }: AdminSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    params.delete('page');
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return (
    <SearchBox
      id={`admin-search-${paramName}`}
      label="Search"
      placeholder={placeholder}
      defaultValue={searchParams.get(paramName) ?? ''}
      onChange={handleChange}
    />
  );
}
