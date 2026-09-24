import { describe, it, expect } from 'vitest';
import { resolvePagination, toPaginatedResult } from './pagination';

describe('resolvePagination', () => {
  it('defaults to page 1, pageSize 20', () => {
    const result = resolvePagination({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(20);
  });

  it('computes the correct skip for a later page', () => {
    const result = resolvePagination({ page: 3, pageSize: 10 });
    expect(result.skip).toBe(20);
    expect(result.take).toBe(10);
  });

  it('clamps page below 1 up to 1', () => {
    expect(resolvePagination({ page: 0 }).page).toBe(1);
    expect(resolvePagination({ page: -5 }).page).toBe(1);
  });

  it('clamps pageSize above 100 down to 100', () => {
    expect(resolvePagination({ pageSize: 1000 }).pageSize).toBe(100);
  });

  it('clamps pageSize below 1 up to 1', () => {
    expect(resolvePagination({ pageSize: 0 }).pageSize).toBe(1);
  });
});

describe('toPaginatedResult', () => {
  it('computes totalPages by rounding up', () => {
    const result = toPaginatedResult(['a', 'b'], 21, 1, 10);
    expect(result.totalPages).toBe(3);
  });

  // totalPages is floored at 1 (never 0), even with zero items — this
  // matches how the UI treats "no pages" the same as "a single empty
  // page": Pagination.tsx renders nothing whenever totalPages <= 1,
  // covering both cases identically.
  it('floors totalPages at 1 even when there are no items', () => {
    const result = toPaginatedResult([], 0, 1, 10);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([]);
  });
});
