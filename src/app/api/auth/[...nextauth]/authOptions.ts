import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await db.user.findFirst({
            where: {
              OR: [
                {
                  email: credentials.identifier,
                },
                {
                  username: credentials.identifier,
                },
              ],
            },
          });
          if (!user) {
              throw new Error("User not found.");
            
          }
          if (!user.isVerified) {
              throw new Error("Please verify your email.");
            
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
          console.log(credentials.password)
          console.log(user.password)
          console.log(isPasswordCorrect)

          if (isPasswordCorrect) {
            return user
          }else {
            throw new Error("Incorrect Password");
          }

        } catch (error: any) {
          throw new Error(error);
        }
      },
      
    }),
  ],
  adapter: PrismaAdapter(db),
  // pages: {
  //   signIn: '/signin',
  // },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
        token, user
    }) {
        if (user) {
          token.userId = user.id?.toString()
          token.username = user.username
          token.isAcceptingMessages = user.isAcceptingMessages
          token.isVerified = user.isVerified
  
        }
        return token
    },
    async session({
        session, token
    }) {
        if (token) {
            session.user.userId = token.userId
            session.user.username = token.username
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
        }
 
        return session
    }
  }
};
