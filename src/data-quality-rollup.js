/**
 * Roll up data-quality records by status.
 *
 * Each record may carry:
 *   - status:   one of "valid", "invalid", "unmapped"
 *   - user_id:  the affected user (string), only collected for invalid/unmapped
 *
 * Null entries are skipped. Unknown statuses are counted as "unmapped".
 * `counts` holds the three categories, `total` is the number of non-null
 * records, `invalid_rate` is invalid / total (0 when total is 0), and
 * `affected_users` is the deduplicated, lexicographically sorted list of
 * non-empty user_ids from invalid/unmapped records.
 *
 * @param {Array<{ status?: string, user_id?: string } | null>} records
 * @returns {{ counts: { valid: number, invalid: number, unmapped: number }, total: number, invalid_rate: number, affected_users: string[] }}
 */
export function dataQualityRollup(records) {
  const list = Array.isArray(records) ? records : [];

  const counts = { valid: 0, invalid: 0, unmapped: 0 };
  const affected = new Set();

  for (const record of list) {
    if (record == null) continue;

    const status = record.status;
    if (status === "valid") {
      counts.valid += 1;
    } else if (status === "invalid") {
      counts.invalid += 1;
    } else {
      counts.unmapped += 1;
    }

    if (status === "valid") continue;
    const user_id = record.user_id;
    if (user_id != null && user_id !== "") {
      affected.add(user_id);
    }
  }

  const total = counts.valid + counts.invalid + counts.unmapped;
  const affected_users = [...affected].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );

  return {
    counts,
    total,
    invalid_rate: total === 0 ? 0 : counts.invalid / total,
    affected_users,
  };
}
