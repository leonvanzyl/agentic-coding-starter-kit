import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 Proxy for auth protection.
 * Uses cookie-based checks for fast, optimistic redirects.
 *
 * Note: This only checks for cookie existence, not validity.
 * Full session validation should be done in each protected page/route.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Optimistic redirect - cookie existence check only
  // Full validation happens in page components via auth.api.getSession()
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/chat", "/profile"], // Protected routes
};
