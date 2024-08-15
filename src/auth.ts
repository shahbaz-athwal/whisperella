import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (!user.username) {
          const username = user.email!.split("@")[0];
          await db.user.update({
            where: {
              email: user.email!,
            },
            data: {
              username: username,
              isVerified: true,
            },
          });
          user.username = username;
        }
        token.userId = user.id;
        token.username = user.username;
        token.picture = user.image;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId as string;
        session.user.username = token.username as string;
        session.user.image = token.picture as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },

  ...authConfig,
});
