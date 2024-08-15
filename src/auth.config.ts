import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import type { User } from "next-auth";

import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        identifier: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "" },
      },
      async authorize(credentials): Promise<User> {
        try {
          const user = await db.user.findFirst({
            where: {
              OR: [
                {
                  email: credentials.identifier as string,
                },
                {
                  username: credentials.identifier as string,
                },
              ],
            },
          });
          if (!user) {
            throw new Error("User not found.");
          }
          if (!user.password) {
            throw new Error("Signin with Google or Github");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email.");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.password!
          );
          if (isPasswordCorrect) {
            return {
              userId: user.id.toString(),
              name: user.name,
              username: user.username!,
              email: user.email,
              image: user.image,
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
            };
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
