export function multiCommitPlanSummary(commits) {
  const total_commits = commits.length;
  const reviewed_commits = commits.filter((commit) => commit.reviewed === true).length;
  const pending_commits = total_commits - reviewed_commits;
  const all_reviewed = pending_commits === 0;
  const next_pending_commit = commits.find((commit) => commit.reviewed !== true) ?? null;
  return { total_commits, reviewed_commits, pending_commits, all_reviewed, next_pending_commit };
}

export function multiCommitPlanStatus(summary) {
  return summary.all_reviewed === true ? "ready_to_merge" : "needs_review";
}
