// ✅ Auth.js / NextAuth v5 configuration file
import type { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import GitLab from "next-auth/providers/gitlab";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";

import { db } from "@/server/db";
import { signInSchema } from "@/lib/zod";
import { saltAndHashPassword, getUserFromDB } from "@/lib/utils";
import { ZodError } from "zod";
import type { User } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// ✅ App Router compatible configuration
export const authConfig = {
  adapter: PrismaAdapter(db),

  providers: [
    
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const pwHash = await saltAndHashPassword(password);
          const user = await getUserFromDB(email, pwHash);

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
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  pages: {
    signIn: "/login",
  },
} satisfies AuthOptions;