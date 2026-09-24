import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the auth session via Next.js cookies so the user's
 * session is available on the server without a client-side round trip.
 *
 * ASYNC: `cookies()` from `next/headers` became async as of Next.js 15
 * (returns `Promise<ReadonlyRequestCookies>`), so this factory — and every
 * caller — must be awaited.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — safe to ignore because
            // middleware already refreshes the session cookie.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}

/**
 * Admin/service-role client — SERVER ONLY, never import this from a file
 * that could be bundled into the client. Bypasses Row Level Security.
 * Use sparingly and only for trusted server-side operations (e.g. webhook
 * handlers verifying a payment before writing an Order).
 *
 * Not async itself (it doesn't touch cookies — the service role never
 * needs a user session), but kept as a plain function for a consistent
 * call pattern with createSupabaseServerClient.
 */
export function createSupabaseServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}
