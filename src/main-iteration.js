export function mainIterationSummary(entries) {
  const total = entries.length;
  const completed = entries.filter((entry) => entry.status === "done").length;
  const open = total - completed;
  const nextOpenEntry = entries.find((entry) => entry.status !== "done") ?? null;
  return {
    total_entries: total,
    completed_entries: completed,
    open_entries: open,
    all_done: total > 0 && completed === total,
    next_open_entry: nextOpenEntry,
  };
}

export function mainIterationLabel(summary) {
  return summary.all_done === true ? "done" : "active";
}
