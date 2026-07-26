export function releaseWindowStatus(window) {
  const now = new Date(window.now).getTime();
  const startedAt = new Date(window.started_at).getTime();
  const endedAt = new Date(window.ended_at).getTime();

  if (now < startedAt) return "scheduled";
  if (now > endedAt) return "closed";
  return "open";
}

export function releaseWindowSummary(window) {
  const status = releaseWindowStatus(window);
  return {
    status,
    is_open: status === "open",
    started_at: window.started_at,
    ended_at: window.ended_at,
  };
}
