import { prisma } from "@/lib/prisma";
import { fetchGitHubCommits } from "./github";
import { fetchGitLabCommits } from "./gitlab";

export type CommitData = {
  sha: string;
  message: string;
  timestamp: string;
  author: string;
};


export async function syncCommitsForTimeLog(
  timelogId: string,
  userId: string,
): Promise<void> {
  const timelog = await prisma.timeLog.findUnique({
    where: { id: timelogId },
    include: { project: { include: { Repository: true } } },
  });


  if (!timelog?.project?.Repository?.length) return;

  const since = timelog.start.toISOString();
  const until = (timelog.end ?? new Date()).toISOString();

  for (const repo of timelog.project.Repository) {
    const token = await getTokenForUser(
      userId,
      repo.provider as "github" | "gitlab",
    );
    let commits: CommitData[] = [];

    if (repo.provider === "github") {

      const repoFullName = repo.url.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1];
      if (repoFullName) {
       
        commits = await fetchGitHubCommits(token, repoFullName, since, until);
      }
    } else if (repo.provider === "gitlab") {
 
      const projectId = repo.url.match(/gitlab\.com[:/](.+?)(?:\.git)?$/)?.[1];
      if (projectId) {
        
        commits = await fetchGitLabCommits(
          token,
          encodeURIComponent(projectId),
          since,
          until,
        );
      }
    }

    
    for (const { sha, message, timestamp, author } of commits) {
      try {
        await prisma.commit.create({
          data: {
            sha,
            message,
            timestamp: new Date(timestamp),
            author,
            repoId: repo.id,
            timelogId,
          },
        });
      } catch {
        
      }
    }
  }
}

async function getTokenForUser(
  userId: string,
  provider: "github" | "gitlab",
): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { userId, provider },
    select: { access_token: true },
  });

  if (!account?.access_token) {
    throw new Error(`No access token found for provider: ${provider}`);
  }

  return account.access_token;
}
