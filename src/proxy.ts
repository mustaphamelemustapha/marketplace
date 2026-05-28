import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth-edge';

// Define route matching guards
const SELLER_ROUTES = ['/seller'];
const ADMIN_ROUTES = ['/admin'];
const AUTHENTICATED_ROUTES = ['/cart', '/checkout', '/orders'];

// Protected API routes
const SELLER_API_ROUTES = ['/api/dashboard/seller'];
const AUTHENTICATED_API_ROUTES = ['/api/orders', '/api/cart'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  let decoded = null;
  if (token) {
    decoded = await verifyJWT(token);
  }

  // Redirect functions
  const loginRedirect = () => {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  };

  const unauthorizedRedirect = () => {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  };

  const apiUnauthorized = (message = 'Unauthorized') => {
    return NextResponse.json({ error: message }, { status: 401 });
  };

  const apiForbidden = (message = 'Forbidden') => {
    return NextResponse.json({ error: message }, { status: 403 });
  };

  // 1. Guard API Routes
  if (SELLER_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!decoded) return apiUnauthorized();
    if (decoded.role !== 'SELLER' && decoded.role !== 'ADMIN') {
      return apiForbidden();
    }
  }

  if (AUTHENTICATED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!decoded) return apiUnauthorized();
  }

  // 2. Guard Pages
  if (SELLER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!decoded) return loginRedirect();
    if (decoded.role !== 'SELLER' && decoded.role !== 'ADMIN') {
      return unauthorizedRedirect();
    }
  }

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!decoded) return loginRedirect();
    if (decoded.role !== 'ADMIN') {
      return unauthorizedRedirect();
    }
  }

  if (AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!decoded) return loginRedirect();
  }

  // 3. Prevent logged-in users from accessing Login / Register
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (decoded) {
      const redirectPath = decoded.role === 'SELLER' ? '/seller' : '/';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/seller/:path*',
    '/admin/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/login',
    '/register',
    '/api/orders/:path*',
    '/api/cart/:path*',
    '/api/dashboard/:path*',
  ],
};
