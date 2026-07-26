export function agentOwnedSignal(events) {
  const list = Array.isArray(events) ? events : [];
  return {
    total_events: list.length,
    agent_events: list.filter((event) => event.actor === "agent").length,
    needs_review: list.some((event) => event.severity === "high"),
  };
}
