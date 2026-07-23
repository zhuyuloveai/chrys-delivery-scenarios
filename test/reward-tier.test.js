import test from "node:test";
import assert from "node:assert/strict";
import { rewardTier } from "../src/reward-tier.js";

test("rewardTier returns starter for score 0", () => {
  assert.equal(rewardTier(0), "starter");
});

test("rewardTier returns starter for score 9", () => {
  assert.equal(rewardTier(9), "starter");
});

test("rewardTier returns common for score 10", () => {
  assert.equal(rewardTier(10), "common");
});

test("rewardTier returns common for score 49", () => {
  assert.equal(rewardTier(49), "common");
});

test("rewardTier returns rare for score 50", () => {
  assert.equal(rewardTier(50), "rare");
});

test("rewardTier returns rare for score 99", () => {
  assert.equal(rewardTier(99), "rare");
});

test("rewardTier returns legendary for score 100", () => {
  assert.equal(rewardTier(100), "legendary");
});

test("rewardTier returns legendary for score 999", () => {
  assert.equal(rewardTier(999), "legendary");
});
