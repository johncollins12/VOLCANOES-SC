import type { RoleName } from '@/config/roles';

/**
 * The authenticated user shape used throughout the app (Server Components,
 * Server Actions, admin UI). Distinct from Supabase's own User type because
 * it merges in our application-level roles from Postgres.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: RoleName[];
}

/**
 * Standard shape returned by every Server Action so client components can
 * handle success/error consistently without try/catch boilerplate spread
 * across the UI layer.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Generic pagination params shared by any list-fetching Server Action
 * (news, players, fixtures, orders, etc.).
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
