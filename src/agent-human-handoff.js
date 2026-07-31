export function summarizeHandoffParticipation(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const agentEntries = list.filter((entry) => entry.actor === "agent").length;
  const humanEntries = list.filter((entry) => entry.actor === "human").length;
  return {
    total: list.length,
    agent_entries: agentEntries,
    human_entries: humanEntries,
    mixed: agentEntries > 0 && humanEntries > 0,
    manual_review_required: humanEntries > 0,
  };
}
