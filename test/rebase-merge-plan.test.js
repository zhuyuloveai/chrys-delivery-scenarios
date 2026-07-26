import test from "node:test";
import assert from "node:assert/strict";
import { rebaseMergePlanSummary } from "../src/rebase-merge-plan.js";

test("rebaseMergePlanSummary counts a mix of replayable and blocked commits", () => {
  const summary = rebaseMergePlanSummary([
    { id: "a", replayable: true },
    { id: "b", replayable: false },
    { id: "c", replayable: true },
  ]);

  assert.deepEqual(summary, {
    total_commits: 3,
    replayable_commits: 2,
    blocked_commits: 1,
    ready_to_rebase: false,
    first_blocked_commit: { id: "b", replayable: false },
  });
});

test("rebaseMergePlanSummary is ready to rebase when all commits are replayable", () => {
  const summary = rebaseMergePlanSummary([
    { id: "a", replayable: true },
    { id: "b", replayable: true },
  ]);

  assert.deepEqual(summary, {
    total_commits: 2,
    replayable_commits: 2,
    blocked_commits: 0,
    ready_to_rebase: true,
    first_blocked_commit: null,
  });
});

test("rebaseMergePlanSummary returns zeros and not ready for empty input", () => {
  assert.deepEqual(rebaseMergePlanSummary([]), {
    total_commits: 0,
    replayable_commits: 0,
    blocked_commits: 0,
    ready_to_rebase: false,
    first_blocked_commit: null,
  });
});

test("rebaseMergePlanSummary treats non-array input as empty", () => {
  for (const input of [null, undefined, {}, 42, "nope"]) {
    assert.deepEqual(rebaseMergePlanSummary(input), {
      total_commits: 0,
      replayable_commits: 0,
      blocked_commits: 0,
      ready_to_rebase: false,
      first_blocked_commit: null,
    });
  }
});

test("rebaseMergePlanSummary only treats strict replayable === true as replayable", () => {
  const summary = rebaseMergePlanSummary([
    { id: "a", replayable: true },
    { id: "b", replayable: 1 },
    { id: "c" },
    { id: "d", replayable: "true" },
    { id: "e", replayable: null },
  ]);

  assert.equal(summary.total_commits, 5);
  assert.equal(summary.replayable_commits, 1);
  assert.equal(summary.blocked_commits, 4);
  assert.equal(summary.ready_to_rebase, false);
  assert.deepEqual(summary.first_blocked_commit, { id: "b", replayable: 1 });
});

test("rebaseMergePlanSummary reports the first blocked commit by reference", () => {
  const firstBlocked = { id: "x", replayable: false };
  const summary = rebaseMergePlanSummary([
    { id: "a", replayable: true },
    firstBlocked,
    { id: "b", replayable: false },
  ]);

  assert.equal(summary.first_blocked_commit, firstBlocked);
});
