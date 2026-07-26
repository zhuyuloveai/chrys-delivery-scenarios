export function handoffStatusSummary(items) {
  const list = Array.isArray(items) ? items : [];
  const completed = list.filter((item) => item.done === true);
  const open = list.filter((item) => item.done !== true);
  const nextOpen = open.length > 0 ? open[0] : null;
  return {
    total_items: list.length,
    completed_items: completed.length,
    open_items: open.length,
    ready_for_handoff: list.length > 0 && completed.length === list.length,
    next_open_item: nextOpen,
  };
}
