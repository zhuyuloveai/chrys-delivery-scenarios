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

export function comboMultiplier(events) {
  let maxCombo = 0;
  let currentCombo = 0;
  for (const event of events) {
    if (event.combo === true) {
      currentCombo++;
      if (currentCombo > maxCombo) maxCombo = currentCombo;
    } else {
      currentCombo = 0;
    }
  }
  return 1 + Math.floor(maxCombo / 3) * 0.25;
}

export function totalScoreWithCombo(events) {
  return Math.round(baseScore(events) * comboMultiplier(events));
}
