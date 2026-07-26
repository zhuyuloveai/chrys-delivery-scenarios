export function rewardTier(score) {
  if (score >= 100) return "legendary";
  if (score >= 50) return "rare";
  if (score >= 10) return "common";
  return "starter";
}

export function describeRewardTier(tier) {
  switch (tier) {
    case "legendary":
      return "Legendary tier";
    case "rare":
      return "Rare tier";
    case "common":
      return "Common tier";
    case "starter":
      return "Starter tier";
    default:
      return "Unknown tier";
  }
}
