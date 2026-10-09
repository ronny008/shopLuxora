import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const session = token ? verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session);
  const isAdmin = session?.role === 'Admin';

  // 1. Protect Admin routes (/dashboard, /dashboard/*)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      // Authenticated but not an Admin - redirect to storefront with notice
      const forbiddenUrl = new URL('/profile', request.url);
      forbiddenUrl.searchParams.set('error', 'admin_access_required');
      return NextResponse.redirect(forbiddenUrl);
    }

    return NextResponse.next();
  }

  // 2. Redirect logged-in users away from /login and /register
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
