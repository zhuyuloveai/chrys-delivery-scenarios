/**
 * Summarize participation in a mixed agent/human reporting handoff.
 *
 * Each entry is expected to carry an `actor` field of "agent" or "human".
 * Entries with any other actor value (e.g. "system") still count toward
 * `total` but not toward either participation count. Null entries are
 * skipped. Human entries with an explicitly blank `name` (empty or
 * whitespace-only) are ignored as incomplete rows; entries without a
 * `name` field are unaffected. `mixed` is true when both agent and human
 * entries are present.
 *
 * @param {Array<{ actor?: string, name?: string } | null>} entries
 * @returns {{ total: number, agent_entries: number, human_entries: number, mixed: boolean }}
 */
export function summarizeHandoffParticipation(entries) {
  const list = Array.isArray(entries) ? entries : [];

  let total = 0;
  let agentEntries = 0;
  let humanEntries = 0;

  for (const entry of list) {
    if (entry == null) continue;
    // Human entries with an explicitly blank name are incomplete rows.
    if (
      entry.actor === "human" &&
      typeof entry.name === "string" &&
      entry.name.trim() === ""
    ) {
      continue;
    }
    total++;
    if (entry.actor === "agent") {
      agentEntries++;
    } else if (entry.actor === "human") {
      humanEntries++;
    }
  }

  return {
    total,
    agent_entries: agentEntries,
    human_entries: humanEntries,
    mixed: agentEntries > 0 && humanEntries > 0,
  };
}
