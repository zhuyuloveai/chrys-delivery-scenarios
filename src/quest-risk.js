/**
 * Classify a quest's risk level based on its danger score.
 *
 * @param {{ danger: number }} quest
 * @returns {"low" | "medium" | "high"}
 */
export function questRiskLevel(quest) {
  if (quest.danger >= 9) {
    return "high";
  }
  if (quest.danger >= 4) {
    return "medium";
  }
  return "low";
}
