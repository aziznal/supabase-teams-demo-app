import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // all pages are protected except for the auth pages (i.e. login and signup)
  const isProtectedPage = !request.nextUrl.pathname.startsWith("/auth");

  if (!isProtectedPage) return;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  const url = new URL("/auth", request.url);

  if (error || !data) return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
