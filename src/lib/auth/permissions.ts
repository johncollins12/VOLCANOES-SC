import type { AuthenticatedUser } from '@/types';
import { ROLES, type RoleName } from '@/config/roles';

/**
 * RBAC helpers — the second of three enforcement layers described in the
 * architecture doc (§5): Supabase RLS (DB) → these helpers (app layer) →
 * conditional UI rendering (cosmetic only). Never rely on UI hiding alone.
 */

export function hasRole(user: AuthenticatedUser | null, ...allowed: RoleName[]): boolean {
  if (!user) return false;
  if (user.roles.includes(ROLES.SUPER_ADMIN)) return true; // super admin bypasses all checks
  return allowed.some((role) => user.roles.includes(role));
}

export function isSuperAdmin(user: AuthenticatedUser | null): boolean {
  return !!user && user.roles.includes(ROLES.SUPER_ADMIN);
}

/**
 * Throws a typed error if the user lacks any of the allowed roles.
 * Use inside Server Actions before performing a mutation, e.g.:
 *
 *   const user = await requireUser();
 *   requireRole(user, ROLES.CONTENT_EDITOR);
 */
export function requireRole(user: AuthenticatedUser, ...allowed: RoleName[]): void {
  if (!hasRole(user, ...allowed)) {
    throw new Error('FORBIDDEN');
  }
}
