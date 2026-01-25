import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/config";

const handler = NextAuth(authConfig);

export const { GET, POST } = handler.handlers;