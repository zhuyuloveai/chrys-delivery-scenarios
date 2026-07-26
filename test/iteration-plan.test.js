import test from "node:test";
import assert from "node:assert/strict";
import { iterationPlanSummary, iterationPlanStatus } from "../src/iteration-plan.js";

test("iterationPlanSummary handles mixed complete and incomplete items", () => {
  const items = [
    { done: true },
    { done: false },
    { done: true },
    { done: false },
    { done: true },
  ];
  assert.deepEqual(iterationPlanSummary(items), {
    total_items: 5,
    done_items: 3,
    remaining_items: 2,
    complete: false,
    next_item: { done: false },
  });
});

test("iterationPlanSummary reports complete when all items done", () => {
  const items = [{ done: true }, { done: true }, { done: true }];
  assert.deepEqual(iterationPlanSummary(items), {
    total_items: 3,
    done_items: 3,
    remaining_items: 0,
    complete: true,
    next_item: null,
  });
});

test("iterationPlanSummary handles empty input", () => {
  assert.deepEqual(iterationPlanSummary([]), {
    total_items: 0,
    done_items: 0,
    remaining_items: 0,
    complete: true,
    next_item: null,
  });
});

test("iterationPlanSummary selects the first incomplete item as next_item", () => {
  const items = [
    { done: true, name: "first" },
    { done: false, name: "second" },
    { done: false, name: "third" },
  ];
  assert.deepEqual(iterationPlanSummary(items).next_item, {
    done: false,
    name: "second",
  });
});

test("iterationPlanSummary returns null next_item when all complete", () => {
  const items = [{ done: true, name: "first" }, { done: true, name: "second" }];
  assert.equal(iterationPlanSummary(items).next_item, null);
});

test("iterationPlanStatus returns complete when summary.complete is true", () => {
  const summary = iterationPlanSummary([{ done: true }, { done: true }]);
  assert.equal(iterationPlanStatus(summary), "complete");
});

test("iterationPlanStatus returns in_progress when summary.complete is false", () => {
  const summary = iterationPlanSummary([{ done: true }, { done: false }]);
  assert.equal(iterationPlanStatus(summary), "in_progress");
});
