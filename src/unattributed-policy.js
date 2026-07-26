export function unattributedPolicy(items) {
  const list = Array.isArray(items) ? items : [];
  const blocked_items = list.filter((item) => item && item.blocked === true).length;

  return {
    total_items: list.length,
    blocked_items,
    ready_items: list.length - blocked_items,
    requires_triage: blocked_items > 0,
  };
}
