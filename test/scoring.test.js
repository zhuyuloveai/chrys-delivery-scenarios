import test from "node:test";
import assert from "node:assert/strict";

import { baseScore, streakBonus, comboMultiplier, totalScoreWithCombo, scoreSummary } from "../src/scoring.js";

test("baseScore sums event points", () => {
  assert.equal(baseScore([{ points: 10 }, { points: 15 }]), 25);
});

test("streakBonus returns 0 for empty events", () => {
  assert.equal(streakBonus([]), 0);
});

test("streakBonus returns 0 when no streak events", () => {
  assert.equal(streakBonus([{ streak: false }, { streak: false }]), 0);
});

test("streakBonus returns 0 for single streak event", () => {
  assert.equal(streakBonus([{ streak: true }]), 0);
});

test("streakBonus gives 5 for two consecutive streak events", () => {
  assert.equal(streakBonus([{ streak: true }, { streak: true }]), 5);
});

test("streakBonus gives 10 for three consecutive streak events", () => {
  assert.equal(
    streakBonus([{ streak: true }, { streak: true }, { streak: true }]),
    10,
  );
});

test("streakBonus resets after non-streak event", () => {
  const events = [
    { streak: true },
    { streak: true }, // +5
    { streak: false },
    { streak: true }, // single, no bonus
    { streak: true }, // +5
  ];
  assert.equal(streakBonus(events), 10);
});

test("comboMultiplier returns 1 for events with no combo", () => {
  assert.equal(
    comboMultiplier([{ combo: false }, { combo: false }]),
    1,
  );
});

test("comboMultiplier returns 1 for single combo event", () => {
  assert.equal(comboMultiplier([{ combo: true }]), 1);
});

test("comboMultiplier returns 1 for two consecutive combos", () => {
  assert.equal(
    comboMultiplier([{ combo: true }, { combo: true }]),
    1,
  );
});

test("comboMultiplier returns 1.25 for three consecutive combos", () => {
  assert.equal(
    comboMultiplier([{ combo: true }, { combo: true }, { combo: true }]),
    1.25,
  );
});

test("comboMultiplier returns 1.5 for six consecutive combos", () => {
  const events = Array.from({ length: 6 }, () => ({ combo: true }));
  assert.equal(comboMultiplier(events), 1.5);
});

test("comboMultiplier uses max consecutive length when combo is interrupted", () => {
  const events = [
    { combo: true },
    { combo: true },
    { combo: true },   // streak of 3 → would be 1.25 alone
    { combo: false },  // breaks
    { combo: true },
    { combo: true },   // streak of 2 → still 1.25 from the earlier 3
  ];
  assert.equal(comboMultiplier(events), 1.25);
});

test("totalScoreWithCombo equals baseScore when no combo events", () => {
  const events = [
    { points: 10, combo: false },
    { points: 15, combo: false },
  ];
  assert.equal(totalScoreWithCombo(events), 25);
});

test("totalScoreWithCombo multiplies baseScore by 1.25 for 3 consecutive combos", () => {
  const events = [
    { points: 10, combo: true },
    { points: 10, combo: true },
    { points: 10, combo: true },
    { points: 10, combo: false },
  ];
  // baseScore = 40, multiplier = 1.25 → 50
  assert.equal(totalScoreWithCombo(events), 50);
});

test("totalScoreWithCombo multiplies baseScore by 1.5 for 6 consecutive combos", () => {
  const events = Array.from({ length: 6 }, () => ({ points: 10, combo: true }));
  // baseScore = 60, multiplier = 1.5 → 90
  assert.equal(totalScoreWithCombo(events), 90);
});

test("scoreSummary returns zeros for empty events", () => {
  assert.deepEqual(scoreSummary([]), {
    base: 0,
    streak_bonus: 0,
    combo_multiplier: 1,
    total: 0,
  });
});

test("scoreSummary combines combo multiplier and streak bonus", () => {
  const events = [
    { points: 10, combo: true, streak: true },
    { points: 10, combo: true, streak: true },
    { points: 10, combo: true, streak: true },
  ];
  // base = 30, combo_multiplier = 1.25, totalScoreWithCombo = round(30 * 1.25) = 38
  // streak_bonus = 5 + 5 = 10 → total = 48
  assert.deepEqual(scoreSummary(events), {
    base: 30,
    streak_bonus: 10,
    combo_multiplier: 1.25,
    total: 48,
  });
});
