export async function fetchGitHubCommits(
  token: string,
  repo: string,
  since: string,
  until: string,
) {
  const url = `https://api.github.com/repos/${repo}/commits?since=${since}&until=${until}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("GitHub API error");

  const commits = await res.json();
  return commits.map((c: any) => ({
    sha: c.sha,
    message: c.commit.message,
    timestamp: c.commit.author.date,
    author: c.commit.author.name,
  }));
}