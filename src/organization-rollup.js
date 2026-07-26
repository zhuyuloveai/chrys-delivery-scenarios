/**
 * Summarize contribution metrics across an organization, grouped by department.
 *
 * Each entry may carry:
 *   - department:    the grouping key (string)
 *   - session_count: numeric sessions contributed
 *   - commit_count:  numeric commits contributed
 *   - agent_lines:   numeric agent-generated lines contributed
 *
 * Null entries are skipped, and missing numeric fields are treated as 0.
 * The `departments` array is ordered by department name (lexicographic),
 * and `totals` rolls up every entry across all departments.
 *
 * @param {Array<{ department?: string, session_count?: number, commit_count?: number, agent_lines?: number } | null>} entries
 * @returns {{ departments: Array<{ department: string, session_count: number, commit_count: number, agent_lines: number }>, totals: { session_count: number, commit_count: number, agent_lines: number } }}
 */
export function summarizeOrganizationContributions(entries) {
  const list = Array.isArray(entries) ? entries : [];

  const buckets = new Map();
  const totals = {
    session_count: 0,
    commit_count: 0,
    agent_lines: 0,
  };

  for (const entry of list) {
    if (entry == null) continue;

    const department = entry.department;
    if (!buckets.has(department)) {
      buckets.set(department, {
        department,
        session_count: 0,
        commit_count: 0,
        agent_lines: 0,
      });
    }

    const bucket = buckets.get(department);
    const session_count = Number(entry.session_count) || 0;
    const commit_count = Number(entry.commit_count) || 0;
    const agent_lines = Number(entry.agent_lines) || 0;

    bucket.session_count += session_count;
    bucket.commit_count += commit_count;
    bucket.agent_lines += agent_lines;

    totals.session_count += session_count;
    totals.commit_count += commit_count;
    totals.agent_lines += agent_lines;
  }

  const departments = [...buckets.values()].sort((a, b) =>
    String(a.department) < String(b.department) ? -1 : String(a.department) > String(b.department) ? 1 : 0,
  );

  return { departments, totals };
}
