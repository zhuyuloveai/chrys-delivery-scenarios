import test from "node:test";
import assert from "node:assert/strict";
import { nonProtectedTargetSummary } from "../src/non-protected-target.js";

test("nonProtectedTargetSummary counts mixed stable and experimental items", () => {
  const items = [
    { stable: true },
    { stable: false },
    { stable: true },
    { stable: false },
  ];
  assert.deepEqual(nonProtectedTargetSummary(items), {
    total_items: 4,
    stable_items: 2,
    experimental_items: 2,
    ready_for_protected_branch: false,
  });
});

test("nonProtectedTargetSummary reports ready when every item is stable", () => {
  const items = [
    { stable: true },
    { stable: true },
    { stable: true },
  ];
  assert.deepEqual(nonProtectedTargetSummary(items), {
    total_items: 3,
    stable_items: 3,
    experimental_items: 0,
    ready_for_protected_branch: true,
  });
});

test("nonProtectedTargetSummary handles empty input", () => {
  assert.deepEqual(nonProtectedTargetSummary([]), {
    total_items: 0,
    stable_items: 0,
    experimental_items: 0,
    ready_for_protected_branch: false,
  });
});

test("nonProtectedTargetSummary treats non-array input as empty array", () => {
  assert.deepEqual(nonProtectedTargetSummary(null), {
    total_items: 0,
    stable_items: 0,
    experimental_items: 0,
    ready_for_protected_branch: false,
  });
  assert.deepEqual(nonProtectedTargetSummary(undefined), {
    total_items: 0,
    stable_items: 0,
    experimental_items: 0,
    ready_for_protected_branch: false,
  });
});

test("nonProtectedTargetSummary counts only items with stable === true as stable", () => {
  const items = [
    { stable: true },
    { stable: 1 },
    { stable: "yes" },
    {},
  ];
  assert.deepEqual(nonProtectedTargetSummary(items), {
    total_items: 4,
    stable_items: 1,
    experimental_items: 3,
    ready_for_protected_branch: false,
  });
});
