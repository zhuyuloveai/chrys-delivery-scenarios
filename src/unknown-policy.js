export function unknownPolicySummary(items) {
  const list = Array.isArray(items) ? items : [];
  const unresolved = list.filter((item) => item && item.resolved !== true);

  return {
    total_items: list.length,
    unresolved_items: unresolved.length,
    resolved_items: list.length - unresolved.length,
    has_unknown_work: unresolved.length > 0,
    first_unresolved_item: unresolved[0] ?? null,
  };
}
