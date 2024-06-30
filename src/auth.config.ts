import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import db from "@/lib/db";

import type { NextAuthConfig } from "next-auth"
 
export default { 
    providers: [
          GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            
          }),
          Credentials({
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
                if (!user.password) {
                  throw new Error("Signin with Google or Github");
                }
                if (!user.isVerified) {
                  throw new Error("Please verify your email.");
                }
                const isPasswordCorrect = await bcrypt.compare(
                  credentials.password,
                  user.password!
                );
                if (isPasswordCorrect) {
                  return user;
                } else {
                  throw new Error("Incorrect Password");
                }
              } catch (error: any) {
                throw new Error(error);
              }
            }
          }),
        ]
 } satisfies NextAuthConfig