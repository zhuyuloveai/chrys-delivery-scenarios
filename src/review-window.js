export function reviewWindowSummary(items) {
  const list = Array.isArray(items) ? items : [];
  let pendingCount = 0;
  let highPriorityCount = 0;

  for (const item of list) {
    if (item && item.resolved !== true) pendingCount += 1;
    if (item && item.priority === "high") highPriorityCount += 1;
  }

  return {
    pending_count: pendingCount,
    high_priority_count: highPriorityCount,
  };
}
