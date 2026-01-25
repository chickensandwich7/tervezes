import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";


import { auth } from "@/server/auth"; 

export default async function LoginPage() {

  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <LoginForm />
    </div>
  );
}