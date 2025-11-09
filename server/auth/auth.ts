import { auth } from "./index";

export async function getServerAuthSession() {
  return auth();
}