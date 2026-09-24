import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Runs on every request. Two responsibilities:
 *  1. Refresh the Supabase auth session cookie (required by @supabase/ssr
 *     so server components always see an up-to-date session).
 *  2. Fast-path redirect unauthenticated visitors away from /admin/* before
 *     any Server Component work happens (layer 2.5 of the defense-in-depth
 *     model — a cheaper, earlier check than the layout-level guard).
 *
 * This does NOT replace the layout guard in (admin)/admin/(dashboard)/layout.tsx
 * — both exist intentionally; middleware is fast but coarse (session
 * existence only), the layout guard also confirms the user is active and
 * loads their roles.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const publicAdminRoutes = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
  const isPublicAdminRoute = publicAdminRoutes.includes(request.nextUrl.pathname);

  if (isAdminRoute && !isPublicAdminRoute && !user) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next internals, so the
     * session cookie stays fresh across the whole site, not just /admin.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)',
  ],
};
