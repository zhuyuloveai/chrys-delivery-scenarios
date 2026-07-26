export function squashReadinessSummary(items) {
  const list = Array.isArray(items) ? items : [];
  const ready_items = list.filter((item) => item && item.ready === true).length;
  const total_items = list.length;
  const next_blocked_item = list.find((item) => !item || item.ready !== true) ?? null;

  return {
    total_items,
    ready_items,
    blocked_items: total_items - ready_items,
    ready_to_squash: total_items > 0 && ready_items === total_items,
    next_blocked_item,
  };
}
