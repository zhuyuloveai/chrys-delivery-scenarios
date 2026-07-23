export function crossRepoFeatureFlag(requirementId, repoRole) {
  return `${requirementId}:${repoRole}:enabled`;
}
