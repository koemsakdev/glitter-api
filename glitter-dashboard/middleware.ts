import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'glitter_auth_flag';

// Pages that do NOT require auth
const PUBLIC_PATHS = ['/login'];

// Pages that require auth
const PROTECTED_PATHS = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthed = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  // Not logged in + trying to access protected page → redirect to login
  if (isProtectedPath && !isAuthed) {
    const loginUrl = new URL('/login', request.url);
    // Preserve where they were trying to go so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in + on login page → send to dashboard
  if (isPublicPath && isAuthed && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on relevant paths (skip API routes, static files, etc.)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|upload|.*\\..*).*)',
  ],
};