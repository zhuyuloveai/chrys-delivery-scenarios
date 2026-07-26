export function iterationPlanSummary(items) {
  const total_items = items.length;
  const done_items = items.filter((item) => item.done === true).length;
  const remaining_items = total_items - done_items;
  const complete = remaining_items === 0;
  const next_item = items.find((item) => item.done !== true) ?? null;
  return { total_items, done_items, remaining_items, complete, next_item };
}

export function iterationPlanStatus(summary) {
  return summary.complete === true ? "complete" : "in_progress";
}
