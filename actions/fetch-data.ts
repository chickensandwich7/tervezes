"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function fetchRepositories(provider: "github" | "gitlab") {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Nincs bejelentkezve" };
  }


  const account = await db.account.findFirst({
    where: {
      userId: session.user.id,
      provider: provider,
    },
  });

  if (!account || !account.access_token) {
    return { error: `Nincs összekötve a fiókod a ${provider}-al.` };
  }

  try {
    let data = [];

  
    if (provider === "github") {
      const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (!res.ok) throw new Error("GitHub API hiba");
      data = await res.json();
    }


    if (provider === "gitlab") {
      const res = await fetch("https://gitlab.com/api/v4/projects?membership=true&order_by=updated_at&per_page=10", {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      });
      if (!res.ok) throw new Error("GitLab API hiba");
      data = await res.json();
    }

    return { success: true, data };

  } catch (error) {
    console.error(error);
    return { error: "Nem sikerült lekérni az adatokat." };
  }
}