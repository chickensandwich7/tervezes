import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function saltAndHashPassword(password: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await bcrypt.hash(password, 10);
}

export async function getUserFromDB(email: string, pwHash: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (user?.password == pwHash) return user;
  return null;
}