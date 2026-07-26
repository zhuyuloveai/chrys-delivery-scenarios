/**
 * Classify a quest's risk level based on its danger score.
 *
 * @param {{ danger: number }} quest
 * @returns {"low" | "medium" | "high"}
 */
export function questRiskLevel(quest) {
  if (quest.danger >= 8) {
    return "high";
  }
  if (quest.danger >= 4) {
    return "medium";
  }
  return "low";
}

/**
 * Build a risk summary for a quest.
 *
 * @param {{ danger: number }} quest
 * @returns {{ danger: number, level: "low" | "medium" | "high", requires_review: boolean }}
 */
export function questRiskSummary(quest) {
  const level = questRiskLevel(quest);
  return {
    danger: Number(quest.danger),
    level,
    requires_review: level === "high",
  };
}
