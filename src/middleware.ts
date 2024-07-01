import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const url = req.nextUrl;
  if (
    isAuthenticated &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return Response.redirect(new URL('/dashboard', req.url));
  }

  if (!isAuthenticated && url.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/signin', req.url));
  }
 // code ...
})

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};