import test from "node:test";
import assert from "node:assert/strict";
import { reviewLoadSummary } from "../src/review-load.js";

test("reviewLoadSummary handles an empty array", () => {
  assert.deepEqual(reviewLoadSummary([]), {
    itemCount: 0,
    basePoints: 0,
    blockedCount: 0,
    urgentCount: 0,
    totalLoad: 0,
  });
});

test("reviewLoadSummary sums plain item points", () => {
  const items = [{ points: 5 }, { points: 7 }, { points: 3 }];
  assert.deepEqual(reviewLoadSummary(items), {
    itemCount: 3,
    basePoints: 15,
    blockedCount: 0,
    urgentCount: 0,
    totalLoad: 15,
  });
});

test("reviewLoadSummary adds 3 for each blocked item", () => {
  const items = [{ points: 4, blocked: true }, { points: 6 }];
  assert.deepEqual(reviewLoadSummary(items), {
    itemCount: 2,
    basePoints: 10,
    blockedCount: 1,
    urgentCount: 0,
    totalLoad: 13,
  });
});

test("reviewLoadSummary adds 2 for each urgent item", () => {
  const items = [{ points: 4, urgent: true }, { points: 6 }];
  assert.deepEqual(reviewLoadSummary(items), {
    itemCount: 2,
    basePoints: 10,
    blockedCount: 0,
    urgentCount: 1,
    totalLoad: 12,
  });
});

test("reviewLoadSummary combines blocked and urgent on the same item", () => {
  const items = [
    { points: 5, blocked: true, urgent: true },
    { points: 2, blocked: true },
    { points: 8, urgent: true },
  ];
  // basePoints: 5 + 2 + 8 = 15
  // blocked: 2 * 3 = 6
  // urgent: 2 * 2 = 4
  // totalLoad: 15 + 6 + 4 = 25
  assert.deepEqual(reviewLoadSummary(items), {
    itemCount: 3,
    basePoints: 15,
    blockedCount: 2,
    urgentCount: 2,
    totalLoad: 25,
  });
});

test("reviewLoadSummary ignores truthy non-boolean flags", () => {
  assert.deepEqual(reviewLoadSummary([{ points: 2, blocked: "yes", urgent: 1 }]), {
    itemCount: 1,
    basePoints: 2,
    blockedCount: 0,
    urgentCount: 0,
    totalLoad: 2,
  });
});

test("reviewLoadSummary includes manual adjustment points", () => {
  assert.deepEqual(reviewLoadSummary([{ points: 4, manualAdjustment: 2 }]), {
    itemCount: 1,
    basePoints: 4,
    blockedCount: 0,
    urgentCount: 0,
    totalLoad: 6,
  });
});

test("reviewLoadSummary includes negative manual adjustment points", () => {
  assert.deepEqual(reviewLoadSummary([{ points: 5, manualAdjustment: -2 }]), {
    itemCount: 1,
    basePoints: 5,
    blockedCount: 0,
    urgentCount: 0,
    totalLoad: 3,
  });
});
