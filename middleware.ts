import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async  function middleware(request: NextRequest) {
  // If the user tries to access the root URL
  if (request.nextUrl.pathname === '/') {
    // Redirect them to the sign-in page
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // return NextResponse.next();
  return await updateSession(request);
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: '/',
};