/**
 * Summarize contribution entries scoped to a department subtree rooted at `rootPath`.
 *
 * `rootPath` is an array of path segments (e.g. ["Engineering", "Platform"]).
 * Only entries whose `department_path` is prefixed by `rootPath` are counted.
 * The returned summary holds:
 *   - direct_count:   entries whose path is exactly equal to `rootPath`
 *   - total_count:    every entry in the subtree (path prefixed by `rootPath`)
 *   - distinct_users: deduplicated users within the subtree, sorted lexicographically
 *
 * Invalid entries (null, or those without a `department_path` string array) are
 * ignored. Entries missing a `user` still count toward the totals but contribute
 * nothing to `distinct_users`.
 *
 * @param {Array<{ department_path?: string[], user?: string } | null>} entries
 * @param {string[]} rootPath
 * @returns {{ direct_count: number, total_count: number, distinct_users: string[] }}
 */
export function departmentScopeSummary(entries, rootPath) {
  const list = Array.isArray(entries) ? entries : [];
  const prefix = Array.isArray(rootPath) ? rootPath : [];

  let direct_count = 0;
  let total_count = 0;
  const users = new Set();

  for (const entry of list) {
    if (entry == null) continue;

    const path = entry.department_path;
    if (!isPathArray(path) || !startsWith(path, prefix)) continue;

    total_count += 1;
    if (path.length === prefix.length) direct_count += 1;

    if (typeof entry.user === "string" && entry.user.length > 0) {
      users.add(entry.user);
    }
  }

  return {
    direct_count,
    total_count,
    distinct_users: [...users].sort(),
  };
}

function isPathArray(value) {
  return Array.isArray(value) && value.every((seg) => typeof seg === "string");
}

function startsWith(path, prefix) {
  if (path.length < prefix.length) return false;
  return prefix.every((seg, i) => path[i] === seg);
}
