export function protectedIterationSummary(steps) {
  const total = steps.length;
  const reviewed = steps.filter((step) => step.phase === "reviewed").length;
  const pending = total - reviewed;
  const nextPendingStep = steps.find((step) => step.phase !== "reviewed") ?? null;
  return {
    total_steps: total,
    reviewed_steps: reviewed,
    pending_steps: pending,
    review_complete: total > 0 && reviewed === total,
    next_pending_step: nextPendingStep,
  };
}

export function protectedIterationLabel(summary) {
  return summary.review_complete === true ? "reviewed" : "pending";
}
