import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DashboardClient from "@/components/dash-client";

export default async function HomePage() {
  const session = await auth();

  // Ha nincs bejelentkezve, irány a login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Szia, {session.user?.name || "Felhasználó"}!</h1>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
          
          <form action={logoutAction}>
            <Button variant="destructive">Kijelentkezés</Button>
          </form>
        </div>

        {/* Client Side Logic (Adatok betöltése) */}
        <DashboardClient userId={session.user.id} />
      </div>
    </div>
  );
}