import { NextResponse, type NextRequest } from 'next/server';

// Sitewide age gate via cookie. If cookie not present, redirect to /age-check
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allowlist paths
  const publicPaths = [
    '/age-check',
    '/api/age-verify',
    '/favicon.ico',
    '/robots.txt',
  ];

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const ageVerified = req.cookies.get('ageVerified')?.value === '1';
  if (ageVerified) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/age-check';
  const nextParam = pathname + (search || '');
  url.searchParams.set('next', nextParam);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*',
};

