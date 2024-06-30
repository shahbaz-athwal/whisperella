import { NextRequest } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth(async(req: NextRequest) => {
  console.log("Hit: ",req.nextUrl.pathname)
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};