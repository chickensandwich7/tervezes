"use client";

import { useState } from "react";
import { fetchRepositories } from "@/actions/fetch-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, Gitlab, Loader2, FolderGit2 } from "lucide-react";
import { toast } from "sonner"; 


type Repo = {
  id: number;
  name: string;
  html_url?: string; // GitHub
  web_url?: string;  // GitLab
  description: string;
};

export default function DashboardClient({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<"github" | "gitlab" | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>("");

  const handleSync = async (provider: "github" | "gitlab") => {
    setLoading(provider);
    setRepos([]); 

    const result = await fetchRepositories(provider);

    if (result.error) {
      alert(result.error); 
    } else {
      setRepos(result.data as Repo[]);
      setActiveProvider(provider);
    }
    
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GitHub Kártya */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" /> GitHub
            </CardTitle>
            <CardDescription>Töltsd be a repository-kat a GitHub-ról</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleSync("github")} 
              disabled={loading === "github"}
              className="w-full"
            >
              {loading === "github" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              GitHub Adatok Betöltése
            </Button>
          </CardContent>
        </Card>

        {/* GitLab Kártya */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gitlab className="w-5 h-5" /> GitLab
            </CardTitle>
            <CardDescription>Töltsd be a projekteket a GitLab-ról</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleSync("gitlab")} 
              disabled={loading === "gitlab"}
              className="w-full"
              variant="outline"
            >
              {loading === "gitlab" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              GitLab Adatok Betöltése
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Eredmények Megjelenítése */}
      {repos.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>
              {activeProvider === "github" ? "GitHub Repository-k" : "GitLab Projektek"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {repos.map((repo) => (
                <div 
                  key={repo.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <FolderGit2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {repo.description || "Nincs leírás"}
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <a 
                      href={repo.html_url || repo.web_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Megnyitás
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}