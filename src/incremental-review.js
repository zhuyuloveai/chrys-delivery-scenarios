export function incrementalReviewQueue(changes) {
  return changes
    .filter((change) => change.reviewed !== true)
    .map((change) => ({
      id: change.id,
      priority: change.priority ?? "normal",
    }));
}
