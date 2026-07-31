export function latestIncrementalCheckpoint(checkpoints) {
  return checkpoints.reduce((latest, checkpoint) => {
    if (!latest) return checkpoint;
    return Date.parse(checkpoint.observed_at) > Date.parse(latest.observed_at)
      ? checkpoint
      : latest;
  }, null);
}
