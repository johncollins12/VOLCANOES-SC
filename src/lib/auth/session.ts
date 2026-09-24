import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { AuthenticatedUser } from '@/types';

/**
 * Returns the currently authenticated user (from Supabase Auth) merged with
 * their application roles (from Postgres via Prisma), or `null` if signed out.
 *
 * Wrapped in React's `cache()` so multiple components/Server Actions in the
 * same request can call this without triggering duplicate lookups.
 */
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: { roles: { include: { role: true } } },
  });

  if (!dbUser || !dbUser.isActive) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName,
    avatarUrl: dbUser.avatarUrl,
    roles: dbUser.roles.map((ur) => ur.role.name),
  };
});

/**
 * Throws if there is no authenticated user. Use at the top of Server Actions
 * / Route Handlers that must never run for anonymous visitors.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}
