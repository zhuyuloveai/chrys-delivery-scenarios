export function rebaseMergePlanSummary(commits) {
  const list = Array.isArray(commits) ? commits : [];
  const replayable_commits = list.filter((commit) => commit && commit.replayable === true).length;
  const total_commits = list.length;
  const blocked_commits = total_commits - replayable_commits;
  const first_blocked_commit = list.find((commit) => !commit || commit.replayable !== true) ?? null;

  return {
    total_commits,
    replayable_commits,
    blocked_commits,
    ready_to_rebase: total_commits > 0 && replayable_commits === total_commits,
    first_blocked_commit,
  };
}
