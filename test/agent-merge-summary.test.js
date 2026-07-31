import test from "node:test";
import assert from "node:assert/strict";

import { summarizeAgentMerge } from "../src/agent-merge-summary.js";

test("totals additions and deletions across multiple changes", () => {
  const changes = [
    { additions: 10, deletions: 2 },
    { additions: 5, deletions: 8 },
    { additions: 20, deletions: 0 },
  ];

  assert.deepEqual(summarizeAgentMerge(changes), {
    additions: 35,
    deletions: 10,
    total_changes: 45,
    net_changes: 25,
  });
});

test("reports a negative net when deletions exceed additions", () => {
  const changes = [
    { additions: 3, deletions: 10 },
    { additions: 1, deletions: 5 },
  ];

  assert.deepEqual(summarizeAgentMerge(changes), {
    additions: 4,
    deletions: 15,
    total_changes: 19,
    net_changes: -11,
  });
});

test("treats missing fields as zero", () => {
  const changes = [
    { additions: 7 },
    { deletions: 4 },
    {},
    { additions: "3", deletions: "2" },
  ];

  assert.deepEqual(summarizeAgentMerge(changes), {
    additions: 10,
    deletions: 6,
    total_changes: 16,
    net_changes: 4,
  });
});

test("skips null entries", () => {
  const changes = [
    null,
    { additions: 8, deletions: 1 },
    null,
    { additions: 2, deletions: 3 },
    null,
  ];

  assert.deepEqual(summarizeAgentMerge(changes), {
    additions: 10,
    deletions: 4,
    total_changes: 14,
    net_changes: 6,
  });
});

test("returns zeros for empty input", () => {
  assert.deepEqual(summarizeAgentMerge([]), {
    additions: 0,
    deletions: 0,
    total_changes: 0,
    net_changes: 0,
  });
});

test("returns zeros for non-array input", () => {
  assert.deepEqual(summarizeAgentMerge(undefined), {
    additions: 0,
    deletions: 0,
    total_changes: 0,
    net_changes: 0,
  });
});

test("handles a mix of nulls, empty objects, and string numbers", () => {
  const changes = [
    null,
    { additions: 12, deletions: 4 },
    {},
    { deletions: "6" },
    { additions: "0", deletions: "1" },
    null,
  ];

  assert.deepEqual(summarizeAgentMerge(changes), {
    additions: 12,
    deletions: 11,
    total_changes: 23,
    net_changes: 1,
  });
});
