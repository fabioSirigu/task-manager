import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { routing } from './i18n/routing';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const {locales, defaultLocale} = routing
const publicRoutes = ['/sign-in(.*)', '/sign-up(.*)'];
const localizedPublicRoutes = locales.flatMap((locale) =>
  publicRoutes.map((route) => `/${locale}${route}`),
);

const isPublicRoute = createRouteMatcher([...publicRoutes, ...localizedPublicRoutes]);

function getLocale(request: Request): string {
  const headers = Object.fromEntries(request.headers.entries());
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // <-- esclude /api correttamente
};
