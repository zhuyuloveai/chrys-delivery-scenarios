export function lootRarity(dropRate) {
  if (dropRate <= 0.01) return "mythic";
  if (dropRate <= 0.05) return "epic";
  if (dropRate <= 0.2) return "rare";
  return "common";
}
