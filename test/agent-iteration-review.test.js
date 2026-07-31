import test from "node:test";
import assert from "node:assert/strict";
import { summarizeReviewIteration } from "../src/agent-iteration-review.js";

test("summarizeReviewIteration counts completed, pending, and overdue items", () => {
  const items = [
    { done: true, id: "a" },
    { done: false, overdue: true, id: "b" },
    { done: true, id: "c" },
    { done: false, id: "d" },
    { done: true },
    { done: false, overdue: true },
  ];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 6,
    completed: 3,
    pending: 3,
    overdue_pending: 2,
    next_pending_id: "b",
    completion_rate: 0.5,
  });
});

test("summarizeReviewIteration reports full completion", () => {
  const items = [{ done: true, id: "x" }, { done: true, id: "y" }, { done: true }];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 3,
    completed: 3,
    pending: 0,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 1,
  });
});

test("summarizeReviewIteration handles empty input", () => {
  assert.deepEqual(summarizeReviewIteration([]), {
    total: 0,
    completed: 0,
    pending: 0,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 0,
  });
});

test("summarizeReviewIteration handles non-array input", () => {
  assert.deepEqual(summarizeReviewIteration(null), {
    total: 0,
    completed: 0,
    pending: 0,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 0,
  });
  assert.deepEqual(summarizeReviewIteration(undefined), {
    total: 0,
    completed: 0,
    pending: 0,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 0,
  });
});

test("summarizeReviewIteration counts items without done flag as pending", () => {
  const items = [{ done: true }, { note: "in progress" }, { done: false }];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 3,
    completed: 1,
    pending: 2,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 1 / 3,
  });
});

test("summarizeReviewIteration counts null items as pending", () => {
  const items = [null, null, { done: true }];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 3,
    completed: 1,
    pending: 2,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 1 / 3,
  });
});

test("summarizeReviewIteration reports zero completion when nothing is done", () => {
  const items = [{ done: false }, { done: false }];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 2,
    completed: 0,
    pending: 2,
    overdue_pending: 0,
    next_pending_id: null,
    completion_rate: 0,
  });
});

test("summarizeReviewIteration counts overdue only among pending items", () => {
  const items = [
    { done: true, overdue: true },
    { done: false, overdue: true },
    { done: false },
    { done: false, overdue: true },
  ];
  const result = summarizeReviewIteration(items);
  assert.equal(result.completed, 1);
  assert.equal(result.pending, 3);
  assert.equal(result.overdue_pending, 2);
});

test("summarizeReviewIteration reports two overdue pending items and selects the first pending id", () => {
  const items = [
    { done: false, overdue: true, id: "first" },
    { done: false, overdue: true, id: "second" },
    { done: true, id: "done" },
  ];
  assert.deepEqual(summarizeReviewIteration(items), {
    total: 3,
    completed: 1,
    pending: 2,
    overdue_pending: 2,
    next_pending_id: "first",
    completion_rate: 1 / 3,
  });
});

test("summarizeReviewIteration picks the first pending item with a non-empty id", () => {
  const items = [
    { done: false, id: "" },
    { done: false, id: "b" },
    { done: false, id: "c" },
    { done: true, id: "d" },
  ];
  assert.equal(summarizeReviewIteration(items).next_pending_id, "b");
});
