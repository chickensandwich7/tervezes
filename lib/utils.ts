import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function saltAndHashPassword(password: string) {
  
  return await bcrypt.hash(password, 10);
}

export async function getUserFromDB(email: string, pwHash: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) return null;
  const passwordsMatch = await bcrypt.compare(pwHash, user.password);

  if (passwordsMatch) {
    return user;
  }

}