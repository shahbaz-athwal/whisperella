import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const url = req.nextUrl;
  if (
    isAuthenticated &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  if (
    !isAuthenticated &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/feedback"))
  ) {
    return Response.redirect(new URL("/signin", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup", "/", "/verify/:path*", "/feedback/:path*"],
};
