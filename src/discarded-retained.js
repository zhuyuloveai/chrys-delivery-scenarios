export function retainedSignalSummary(items) {
  const list = Array.isArray(items) ? items : [];
  const retained = list.filter((item) => item.retained === true);
  const total_items = list.length;
  const retained_items = retained.length;
  return {
    total_items,
    retained_items,
    discarded_items: total_items - retained_items,
    retained_ratio: total_items === 0 ? 0 : retained_items / total_items,
    first_retained_item: retained[0] ?? null,
  };
}
