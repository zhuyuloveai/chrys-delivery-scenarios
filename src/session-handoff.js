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

export function handoffOwnerSummary(items) {
  const list = Array.isArray(items) ? items : [];
  const isOwned = (item) =>
    typeof item.owner === "string" && item.owner.trim() !== "";
  const owned = list.filter(isOwned);
  const unowned = list.filter((item) => !isOwned(item));
  const owners = [];
  for (const item of owned) {
    if (!owners.includes(item.owner)) {
      owners.push(item.owner);
    }
  }
  const firstUnowned = unowned.length > 0 ? unowned[0] : null;
  return {
    total_items: list.length,
    owned_items: owned.length,
    unowned_items: unowned.length,
    owners,
    first_unowned_item: firstUnowned,
  };
}
