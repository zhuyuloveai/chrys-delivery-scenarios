import test from "node:test";
import assert from "node:assert/strict";
import { reviewWindowSummary } from "../src/review-window.js";

test("reviewWindowSummary handles an empty array", () => {
  assert.deepEqual(reviewWindowSummary([]), {
    pending_count: 0,
    high_priority_count: 0,
  });
});

test("reviewWindowSummary treats non-array input as empty", () => {
  for (const input of [null, undefined, {}, 42, "nope"]) {
    assert.deepEqual(reviewWindowSummary(input), {
      pending_count: 0,
      high_priority_count: 0,
    });
  }
});

test("reviewWindowSummary counts pending items where resolved !== true", () => {
  const items = [
    { id: "a", resolved: false, priority: "low" },
    { id: "b", resolved: true, priority: "high" },
    { id: "c", priority: "high" },
  ];
  assert.deepEqual(reviewWindowSummary(items), {
    pending_count: 2,
    high_priority_count: 2,
  });
});

test("reviewWindowSummary only treats strict resolved === true as resolved", () => {
  const items = [
    { id: "a", resolved: true },
    { id: "b", resolved: 1 },
    { id: "c", resolved: "true" },
    { id: "d" },
  ];
  assert.deepEqual(reviewWindowSummary(items), {
    pending_count: 3,
    high_priority_count: 0,
  });
});

test("reviewWindowSummary counts high priority items correctly with mixed priorities", () => {
  const items = [
    { id: "a", priority: "high", resolved: false },
    { id: "b", priority: "medium", resolved: false },
    { id: "c", priority: "high", resolved: true },
    { id: "d", priority: "low", resolved: false },
    { id: "e", priority: "high" },
  ];
  assert.deepEqual(reviewWindowSummary(items), {
    pending_count: 4,
    high_priority_count: 3,
  });
});

test("reviewWindowSummary handles all resolved items", () => {
  const items = [
    { id: "a", resolved: true, priority: "high" },
    { id: "b", resolved: true, priority: "low" },
  ];
  assert.deepEqual(reviewWindowSummary(items), {
    pending_count: 0,
    high_priority_count: 1,
  });
});
