import test from "node:test";
import assert from "node:assert/strict";

import { summarizeAgentFinalMerge } from "../src/agent-final-merge.js";

test("summarizeAgentFinalMerge summarizes a mixed list of merge attempts", () => {
  const attempts = [
    { merged: true, ref: "main" },
    { merged: false, ref: "feature/a" },
    { merged: true, ref: "feature/b" },
    { merged: false, ref: "feature/c" },
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 4,
    merged: 2,
    failed: 2,
    all_merged: false,
    first_failed_ref: "feature/a",
  });
});

test("summarizeAgentFinalMerge reports all_merged when every attempt merged", () => {
  const attempts = [
    { merged: true, ref: "main" },
    { merged: true, ref: "feature/a" },
    { merged: true, ref: "feature/b" },
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 3,
    merged: 3,
    failed: 0,
    all_merged: true,
    first_failed_ref: null,
  });
});

test("summarizeAgentFinalMerge returns zeros and not all_merged for empty input", () => {
  assert.deepEqual(summarizeAgentFinalMerge([]), {
    total: 0,
    merged: 0,
    failed: 0,
    all_merged: false,
    first_failed_ref: null,
  });
});

test("summarizeAgentFinalMerge treats non-array input as an empty list", () => {
  assert.deepEqual(summarizeAgentFinalMerge(undefined), {
    total: 0,
    merged: 0,
    failed: 0,
    all_merged: false,
    first_failed_ref: null,
  });
  assert.deepEqual(summarizeAgentFinalMerge(null), {
    total: 0,
    merged: 0,
    failed: 0,
    all_merged: false,
    first_failed_ref: null,
  });
});

test("summarizeAgentFinalMerge counts missing merged field as failed", () => {
  const attempts = [
    { merged: true, ref: "main" },
    { ref: "feature/a" },
    { merged: "true" },
    {},
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 4,
    merged: 1,
    failed: 3,
    all_merged: false,
    first_failed_ref: "feature/a",
  });
});

test("summarizeAgentFinalMerge counts null entries as failed", () => {
  const attempts = [
    { merged: true, ref: "main" },
    null,
    { merged: true, ref: "feature/a" },
    null,
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 4,
    merged: 2,
    failed: 2,
    all_merged: false,
    first_failed_ref: null,
  });
});

test("summarizeAgentFinalMerge reports null when the first failed attempt has no ref", () => {
  const attempts = [
    { merged: true, ref: "main" },
    { merged: false },
    { merged: false, ref: "feature/a" },
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 3,
    merged: 1,
    failed: 2,
    all_merged: false,
    first_failed_ref: null,
  });
});

test("summarizeAgentFinalMerge reports null when the first failed attempt has an empty ref", () => {
  const attempts = [
    { merged: false, ref: "" },
    { merged: false, ref: "feature/a" },
  ];

  assert.deepEqual(summarizeAgentFinalMerge(attempts), {
    total: 2,
    merged: 0,
    failed: 2,
    all_merged: false,
    first_failed_ref: null,
  });
});
