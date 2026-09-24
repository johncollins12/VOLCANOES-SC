'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from './Pagination';

interface URLPaginationProps {
  page: number;
  totalPages: number;
  paramName?: string;
  className?: string;
}

/**
 * Adapts the existing Pagination component (which is callback-driven,
 * `onPageChange: (page) => void`) to URL search-param state, the same
 * pattern CompetitionFilter uses for its filter. Shared by the Fixtures
 * and Results pages rather than each hand-rolling its own router-pushing
 * page handler — this is the one place that logic lives.
 */
export function URLPagination({ page, totalPages, paramName = 'page', className }: URLPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete(paramName);
    } else {
      params.set(paramName, String(nextPage));
    }
    const query = params.toString();
    router.push(query ? `?${query}` : '?');
  }

  return <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} className={className} />;
}
