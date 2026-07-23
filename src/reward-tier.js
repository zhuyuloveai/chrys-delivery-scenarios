export function rewardTier(score) {
  if (score >= 100) return "legendary";
  if (score >= 50) return "rare";
  if (score >= 10) return "common";
  return "starter";
}
