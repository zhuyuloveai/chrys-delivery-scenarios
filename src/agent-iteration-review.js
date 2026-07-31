/**
 * Summarize an agent's review iteration across a list of items.
 *
 * Each item may carry:
 *   - done:    whether the item is completed (boolean)
 *   - overdue: whether a pending item is overdue (boolean)
 *   - id:      the item's identifier (string)
 *
 * Null items and items without `done: true` count as pending. `completed` is
 * the number of items marked done, `pending` is the remainder,
 * `overdue_pending` counts pending items marked `overdue: true`, and
 * `completion_rate` is completed / total (0 when there are no items).
 * `next_pending_id` is the id of the first pending item with a non-empty id,
 * or null when there is none.
 *
 * @param {Array<{ done?: boolean, overdue?: boolean, id?: string } | null>} items
 * @returns {{ total: number, completed: number, pending: number, overdue_pending: number, next_pending_id: string | null, completion_rate: number }}
 */
export function summarizeReviewIteration(items) {
  const list = Array.isArray(items) ? items : [];
  const total = list.length;
  const completed = list.filter((item) => item != null && item.done === true).length;
  const pending = total - completed;
  const overdue_pending = list.filter(
    (item) => item != null && item.done !== true && item.overdue === true,
  ).length;
  const nextPending = list.find(
    (item) =>
      item != null &&
      item.done !== true &&
      item.id != null &&
      item.id !== "",
  );
  return {
    total,
    completed,
    pending,
    overdue_pending,
    next_pending_id: nextPending?.id ?? null,
    completion_rate: total === 0 ? 0 : completed / total,
  };
}
