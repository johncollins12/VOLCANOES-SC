'use client';

import { type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/Feedback';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Pagination } from './Pagination';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string) => void;
  pagination?: { page: number; totalPages: number; onPageChange: (page: number) => void };
  onRowClick?: (row: T) => void;
}

/**
 * The one admin list-view table — orders, players, fixtures, news, users.
 * Every admin CRUD screen should reach for this instead of hand-rolling a
 * <table>, so sorting/loading/empty/pagination behavior (and its
 * accessibility — aria-sort, keyboard-operable headers) is identical
 * everywhere staff manage data. Sorting and pagination are controlled by
 * the caller (typically driving a Server Action re-fetch), matching the
 * same "caller owns the state" pattern as the standalone Pagination
 * component this composes.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  sortKey,
  sortDirection,
  onSortChange,
  pagination,
  onRowClick,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th
                key={col.key}
                className={col.className}
                aria-sort={
                  col.sortable && sortKey === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
                }
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange?.(col.key)}
                    className="flex items-center gap-1 hover:text-accent"
                  >
                    {col.header}
                    {sortKey === col.key ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-3 w-3" aria-hidden />
                      ) : (
                        <ArrowDown className="h-3 w-3" aria-hidden />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" aria-hidden />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Tr key={i}>
                  {columns.map((col) => (
                    <Td key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </Td>
                  ))}
                </Tr>
              ))
            : data.map((row) => (
                <Tr
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((col) => (
                    <Td key={col.key} className={col.className}>
                      {col.render(row)}
                    </Td>
                  ))}
                </Tr>
              ))}
        </Tbody>
      </Table>

      {pagination && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
      )}
    </div>
  );
}
