export async function fetchGitLabCommits(
  token: string,
  projectId: string,
  since: string,
  until: string,
) {
  const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/repository/commits?since=${since}&until=${until}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("GitLab API error");

  const commits = await res.json();
  return commits.map((c: any) => ({
    sha: c.id,
    message: c.title,
    timestamp: c.created_at,
    author: c.author_name,
  }));
}