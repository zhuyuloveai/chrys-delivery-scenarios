/**
 * Summarize whether an agent's merge checks are ready to proceed.
 *
 * Each check may carry:
 *   - passed: whether the check passed (boolean; only `passed === true`
 *     counts as passed)
 *   - name:   the check's name (string)
 *
 * Non-array input is treated as an empty list. Null entries count toward
 * `total` and are treated as failed. `ready` is true only when there is at
 * least one check and every check passed. `first_failed_name` is the name
 * of the first failed check, or null when the first failed check has no
 * name or there are no failures.
 *
 * @param {Array<{ passed?: boolean, name?: string } | null>} checks
 * @returns {{ total: number, passed: number, failed: number, ready: boolean, first_failed_name: string | null }}
 */
export function summarizeAgentMergeReady(checks) {
  const list = Array.isArray(checks) ? checks : [];

  let passed = 0;
  let firstFailedSeen = false;
  let firstFailedName = null;

  for (const check of list) {
    if (check != null && check.passed === true) {
      passed++;
      continue;
    }
    if (!firstFailedSeen) {
      firstFailedSeen = true;
      if (
        check != null &&
        typeof check.name === "string" &&
        check.name !== ""
      ) {
        firstFailedName = check.name;
      }
    }
  }

  const total = list.length;
  const failed = total - passed;
  return {
    total,
    passed,
    failed,
    ready: total > 0 && failed === 0,
    first_failed_name: firstFailedName,
  };
}
