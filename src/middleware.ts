// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod'
);

// Define which roles can access which paths
const routeAccessMap: Record<string, string[]> = {
  '/hr-director': ['HR_DIRECTOR'],
  '/hr-manager': ['HR_DIRECTOR', 'HR_MANAGER'],
  '/hr-executive': ['HR_DIRECTOR', 'HR_MANAGER', 'HR_EXECUTIVE'],
  '/treasury': ['HR_DIRECTOR', 'TREASURY'],
  '/hod': ['HR_DIRECTOR', 'HOD'],
  '/employee': ['HR_DIRECTOR', 'EMPLOYEE'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Let public routes pass through
  if (pathname.startsWith('/login') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // 2. Extract Token
  const token = request.cookies.get('session_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Verify Token
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = payload.role as string;

    // 4. Role-Based Route Protection
    const requiredRoles = Object.entries(routeAccessMap).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      // User is logged in but doesn't have permission for this route
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session_token');
    return response;
  }
}

// Optimize middleware to only run on UI and API routes
export const config = {
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)'],
};