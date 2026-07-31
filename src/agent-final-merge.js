/**
 * Summarize the final merge outcome across a list of merge attempts.
 *
 * Each attempt may carry:
 *   - merged: whether the attempt was merged (boolean; only `merged === true`
 *     counts as merged)
 *   - ref:    the merge reference (string)
 *
 * Non-array input is treated as an empty list. Null entries and attempts
 * without `merged: true` count toward `total` and are treated as failed.
 * `all_merged` is true only when there is at least one attempt and every
 * attempt merged. `first_failed_ref` is the `ref` of the first failed
 * attempt, or null when the first failed attempt has no non-empty ref or
 * there are no failures.
 *
 * @param {Array<{ merged?: boolean, ref?: string } | null>} attempts
 * @returns {{ total: number, merged: number, failed: number, all_merged: boolean, first_failed_ref: string | null }}
 */
export function summarizeAgentFinalMerge(attempts) {
  const list = Array.isArray(attempts) ? attempts : [];

  let merged = 0;
  let firstFailedSeen = false;
  let firstFailedRef = null;

  for (const attempt of list) {
    if (attempt != null && attempt.merged === true) {
      merged++;
      continue;
    }
    if (!firstFailedSeen) {
      firstFailedSeen = true;
      if (
        attempt != null &&
        typeof attempt.ref === "string" &&
        attempt.ref !== ""
      ) {
        firstFailedRef = attempt.ref;
      }
    }
  }

  const total = list.length;
  const failed = total - merged;
  return {
    total,
    merged,
    failed,
    all_merged: total > 0 && failed === 0,
    first_failed_ref: firstFailedRef,
  };
}
