/**
 * Summarize the processing load of a review across its items.
 *
 * Each item may carry:
 *   - points:  numeric base load contribution
 *   - blocked: adds 3 to the total load when truthy
 *   - urgent:  adds 2 to the total load when truthy
 *
 * @param {Array<{ points?: number, blocked?: boolean, urgent?: boolean }>} items
 * @returns {{ itemCount: number, basePoints: number, blockedCount: number, urgentCount: number, totalLoad: number }}
 */
export function reviewLoadSummary(items) {
  const list = Array.isArray(items) ? items : [];

  let basePoints = 0;
  let blockedCount = 0;
  let urgentCount = 0;

  for (const item of list) {
    basePoints += Number(item.points) || 0;
    if (item.blocked === true) blockedCount += 1;
    if (item.urgent === true) urgentCount += 1;
  }

  const manualAdjustment = list.reduce(
    (total, item) => total + Number(item.manualAdjustment ?? 0),
    0,
  );
  const totalLoad = basePoints + manualAdjustment + blockedCount * 3 + urgentCount * 2;

  return {
    itemCount: list.length,
    basePoints,
    blockedCount,
    urgentCount,
    totalLoad,
  };
}
