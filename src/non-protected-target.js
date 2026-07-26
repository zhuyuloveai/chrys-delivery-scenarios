export function nonProtectedTargetSummary(items) {
  const list = Array.isArray(items) ? items : [];
  const stable_items = list.filter((item) => item && item.stable === true).length;
  const total_items = list.length;

  return {
    total_items,
    stable_items,
    experimental_items: total_items - stable_items,
    ready_for_protected_branch: total_items > 0 && stable_items === total_items,
  };
}
