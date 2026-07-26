export function crossRepoFeatureFlag(requirementId, repoRole) {
  return `${requirementId}:${repoRole}:enabled`;
}

export function crossRepoRolloutSummary(requirementId, repoRole, enabled) {
  if (enabled) {
    return {
      requirement_id: requirementId,
      repo_role: repoRole,
      flag: crossRepoFeatureFlag(requirementId, repoRole),
      rollout_state: "enabled",
    };
  }
  return {
    requirement_id: requirementId,
    repo_role: repoRole,
    flag: `${requirementId}:${repoRole}:disabled`,
    rollout_state: "disabled",
  };
}
