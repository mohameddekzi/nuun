import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keeps the Supabase auth session fresh on every request.
 *
 * Without this, an expired access token is never refreshed server-side and the
 * cookies the browser client reads go stale — so client-side queries silently
 * fall back to the `anon` role. That breaks RLS-protected reads (e.g. the media
 * library) and writes (e.g. saving settings). Refreshing here re-issues the
 * cookies for both the server and the browser.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Triggers a token refresh when needed and re-writes the auth cookies.
    await supabase.auth.getUser();
  } catch {
    // Never block a request because the session refresh hiccuped.
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and image files, so the auth
     * session is refreshed for both the public site and the studio.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
