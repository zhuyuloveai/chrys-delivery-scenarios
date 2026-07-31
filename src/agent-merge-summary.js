/**
 * Summarize an agent's merge changes across a list of change objects.
 *
 * Each change object may carry:
 *   - additions: number of lines added
 *   - deletions: number of lines removed
 *
 * Null entries are skipped, and missing numeric fields are treated as 0.
 * `additions` and `deletions` are the summed totals, `total_changes` is the
 * combined count, and `net_changes` is additions minus deletions (negative
 * when more lines were removed than added).
 *
 * @param {Array<{ additions?: number, deletions?: number } | null>} changes
 * @returns {{ additions: number, deletions: number, total_changes: number, net_changes: number }}
 */
export function summarizeAgentMerge(changes) {
  const list = Array.isArray(changes) ? changes : [];

  let additions = 0;
  let deletions = 0;

  for (const change of list) {
    if (change == null) continue;
    additions += Number(change.additions) || 0;
    deletions += Number(change.deletions) || 0;
  }

  return {
    additions,
    deletions,
    total_changes: additions + deletions,
    net_changes: additions - deletions,
  };
}
