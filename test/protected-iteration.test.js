import test from "node:test";
import assert from "node:assert/strict";
import {
  protectedIterationSummary,
  protectedIterationLabel,
} from "../src/protected-iteration.js";

test("protectedIterationSummary counts mixed reviewed and pending steps", () => {
  const steps = [
    { phase: "reviewed" },
    { phase: "pending" },
    { phase: "reviewed" },
    { phase: "draft" },
  ];
  assert.deepEqual(protectedIterationSummary(steps), {
    total_steps: 4,
    reviewed_steps: 2,
    pending_steps: 2,
    review_complete: false,
    next_pending_step: { phase: "pending" },
  });
});

test("protectedIterationSummary reports review_complete when every step is reviewed", () => {
  const steps = [
    { phase: "reviewed" },
    { phase: "reviewed" },
    { phase: "reviewed" },
  ];
  assert.deepEqual(protectedIterationSummary(steps), {
    total_steps: 3,
    reviewed_steps: 3,
    pending_steps: 0,
    review_complete: true,
    next_pending_step: null,
  });
});

test("protectedIterationSummary handles empty input", () => {
  assert.deepEqual(protectedIterationSummary([]), {
    total_steps: 0,
    reviewed_steps: 0,
    pending_steps: 0,
    review_complete: false,
    next_pending_step: null,
  });
});

test("protectedIterationSummary selects the first non-reviewed step as next_pending_step", () => {
  const steps = [
    { phase: "reviewed" },
    { phase: "draft", id: "a" },
    { phase: "pending", id: "b" },
  ];
  assert.deepEqual(protectedIterationSummary(steps).next_pending_step, {
    phase: "draft",
    id: "a",
  });
});

test("protectedIterationSummary returns null next_pending_step when all reviewed", () => {
  const steps = [{ phase: "reviewed" }, { phase: "reviewed" }];
  assert.equal(protectedIterationSummary(steps).next_pending_step, null);
});

test("protectedIterationLabel returns reviewed when review_complete is true", () => {
  assert.equal(
    protectedIterationLabel({
      total_steps: 2,
      reviewed_steps: 2,
      pending_steps: 0,
      review_complete: true,
      next_pending_step: null,
    }),
    "reviewed"
  );
});

test("protectedIterationLabel returns pending when review_complete is false", () => {
  assert.equal(
    protectedIterationLabel({
      total_steps: 2,
      reviewed_steps: 1,
      pending_steps: 1,
      review_complete: false,
      next_pending_step: { phase: "pending" },
    }),
    "pending"
  );
});
