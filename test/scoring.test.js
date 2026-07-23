import test from "node:test";
import assert from "node:assert/strict";

import { baseScore, streakBonus } from "../src/scoring.js";

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
