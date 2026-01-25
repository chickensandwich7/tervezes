
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth"; 

import { db } from "@/server/db";
import { signInSchema } from "@/lib/zod";
import { getUserFromDB } from "@/lib/utils"; 
import { ZodError } from "zod";
console.log("---------------------------------------");
console.log("DEBUG ENV CHECK:");
console.log("GITHUB ID:", process.env.AUTH_GITHUB_ID);
console.log("---------------------------------------");
export const authConfig = {

  adapter: PrismaAdapter(db),


  session: { strategy: "jwt" },

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    GitLab({
      clientId: process.env.AUTH_GITLAB_ID,
      clientSecret: process.env.AUTH_GITLAB_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);


          const user = await getUserFromDB(email, password);

          return user ?? null;
        } catch (err) {
          if (err instanceof ZodError) return null;
          console.error("Credential auth error", err);
          return null;
        }
      },
    }),
  ],


  callbacks: {
    jwt({ token, user }) {

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {

      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;