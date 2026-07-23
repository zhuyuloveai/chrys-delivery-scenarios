export function baseScore(events) {
  return events.reduce((total, event) => total + Number(event.points || 0), 0);
}

export function streakBonus(events) {
  let total = 0;
  let streak = 0;
  for (const event of events) {
    if (event.streak === true) {
      streak++;
      if (streak >= 2) total += 5;
    } else {
      streak = 0;
    }
  }
  return total;
}
