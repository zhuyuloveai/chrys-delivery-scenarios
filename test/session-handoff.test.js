import test from "node:test";
import assert from "node:assert/strict";
import { handoffStatusSummary } from "../src/session-handoff.js";

test("mixed done and open items are counted correctly", () => {
  const items = [{ done: true }, { done: false }, { done: true }];
  const summary = handoffStatusSummary(items);
  assert.deepEqual(summary, {
    total_items: 3,
    completed_items: 2,
    open_items: 1,
    ready_for_handoff: false,
    next_open_item: { done: false },
  });
});

test("all done items are ready for handoff", () => {
  const items = [{ done: true }, { done: true }];
  const summary = handoffStatusSummary(items);
  assert.deepEqual(summary, {
    total_items: 2,
    completed_items: 2,
    open_items: 0,
    ready_for_handoff: true,
    next_open_item: null,
  });
});

test("empty array is not ready for handoff", () => {
  const summary = handoffStatusSummary([]);
  assert.deepEqual(summary, {
    total_items: 0,
    completed_items: 0,
    open_items: 0,
    ready_for_handoff: false,
    next_open_item: null,
  });
});

test("non-array input is treated as empty array", () => {
  const summary = handoffStatusSummary(null);
  assert.deepEqual(summary, {
    total_items: 0,
    completed_items: 0,
    open_items: 0,
    ready_for_handoff: false,
    next_open_item: null,
  });
});

test("non-array object input is treated as empty array", () => {
  const summary = handoffStatusSummary({ done: true });
  assert.deepEqual(summary, {
    total_items: 0,
    completed_items: 0,
    open_items: 0,
    ready_for_handoff: false,
    next_open_item: null,
  });
});

test("only strict done === true counts as completed", () => {
  const items = [
    { done: true },
    { done: 1 },
    { done: "true" },
    { done: "yes" },
    {},
    { done: false },
    { done: null },
    { done: undefined },
  ];
  const summary = handoffStatusSummary(items);
  assert.equal(summary.completed_items, 1);
  assert.equal(summary.open_items, 7);
  assert.equal(summary.ready_for_handoff, false);
  assert.equal(summary.next_open_item.done, 1);
});

test("next_open_item returns the first non-done item", () => {
  const first = { done: true };
  const second = { done: false, id: "next" };
  const summary = handoffStatusSummary([first, second, { done: false }]);
  assert.equal(summary.next_open_item, second);
});

test("next_open_item is null when all done", () => {
  const summary = handoffStatusSummary([{ done: true }]);
  assert.equal(summary.next_open_item, null);
});

test("next_open_item is first item when nothing done", () => {
  const a = { done: false };
  const summary = handoffStatusSummary([a, { done: false }]);
  assert.equal(summary.next_open_item, a);
});
