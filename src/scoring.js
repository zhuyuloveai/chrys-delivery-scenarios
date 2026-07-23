export function baseScore(events) {
  return events.reduce((total, event) => total + Number(event.points || 0), 0);
}
