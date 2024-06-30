import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id?.toString();
        token.username = user.username;
        token.picture = user.image;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token } : any) {
      if (token) {
        session.user.userId = token.userId;
        session.user.username = token.username;
        session.user.image = token.picture;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
    async signIn({ user }) {
      if(!user.username){
        const username = user.email!.split("@")[0]
        console.log(username)
        await db.user.update({
          where: {
            email: user.email!
          },
          data: {
            username: username 
          }
        })
      }
      return true;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },

  ...authConfig,
});
