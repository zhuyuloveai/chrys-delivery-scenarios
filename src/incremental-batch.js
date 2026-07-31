export function incrementalBatchSummary(items) {
  const accepted = items.filter((item) => item.status === "accepted");
  return {
    total: items.length,
    accepted: accepted.length,
    pending: items.length - accepted.length,
    accepted_ids: accepted.map((item) => item.id),
  };
}
