import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './shared/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // Define route protections
  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/';
  const isApiRoute = pathname.startsWith('/api') && !pathname.startsWith('/api/auth');

  // Verify JWT token if present
  let payload = null;
  if (token) {
    payload = await verifyJWT(token);
  }

  // 1. If user is authenticated and tries to visit /auth/login or /auth/register, redirect to dashboard
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT authenticated and tries to visit a protected frontend route, redirect to login
  if (isDashboardRoute && !payload) {
    // If requesting root page "/", let's redirect to auth/login or dashboard depending on auth
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 3. If user is NOT authenticated and tries to access a protected API route, return 401
  if (isApiRoute && !payload) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // If authenticated, we clone the request headers and inject the x-user-id for API route handlers to consume easily
  const requestHeaders = new Headers(request.headers);
  if (payload) {
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
  }

  // For the root path "/", redirect authenticated users to /dashboard
  if (pathname === '/' && payload) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Matching paths config
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (svgs, pngs, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
