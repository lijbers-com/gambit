import { NextRequest, NextResponse } from 'next/server';

/**
 * HTTP Basic Auth gate for the prototype. Validates the request against the
 * BASIC_AUTH_USER / BASIC_AUTH_PASSWORD env vars (set in the Vercel project's
 * Environment Variables). Without a valid match the whole app returns 401 and
 * the browser shows the native password prompt.
 *
 * Note: this only runs for the Next.js app deployment (`next build`). The
 * Storybook deployment is built with `build-storybook`, which ignores Next.js
 * middleware, so this file has no effect there.
 */
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const validUser = process.env.BASIC_AUTH_USER;
  const validPass = process.env.BASIC_AUTH_PASSWORD;

  // If credentials aren't configured, don't lock everyone out.
  if (!validUser || !validPass) {
    return NextResponse.next();
  }

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
