export function unmappedReviewQueue(items) {
  const list = Array.isArray(items) ? items : [];
  const filtered = list.filter(
    (item) =>
      item.department_path === undefined ||
      (Array.isArray(item.department_path) && item.department_path.length === 0)
  );
  filtered.sort((a, b) => (a.user_id || "").localeCompare(b.user_id || ""));
  return { items: filtered, count: filtered.length };
}
