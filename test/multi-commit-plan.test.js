import test from "node:test";
import assert from "node:assert/strict";
import { multiCommitPlanSummary, multiCommitPlanStatus } from "../src/multi-commit-plan.js";

test("multiCommitPlanSummary handles mixed reviewed and pending commits", () => {
  const commits = [
    { reviewed: true },
    { reviewed: false },
    { reviewed: true },
    { reviewed: false },
    { reviewed: true },
  ];
  assert.deepEqual(multiCommitPlanSummary(commits), {
    total_commits: 5,
    reviewed_commits: 3,
    pending_commits: 2,
    all_reviewed: false,
    next_pending_commit: { reviewed: false },
  });
});

test("multiCommitPlanSummary reports all_reviewed when every commit is reviewed", () => {
  const commits = [{ reviewed: true }, { reviewed: true }, { reviewed: true }];
  assert.deepEqual(multiCommitPlanSummary(commits), {
    total_commits: 3,
    reviewed_commits: 3,
    pending_commits: 0,
    all_reviewed: true,
    next_pending_commit: null,
  });
});

test("multiCommitPlanSummary handles empty input", () => {
  assert.deepEqual(multiCommitPlanSummary([]), {
    total_commits: 0,
    reviewed_commits: 0,
    pending_commits: 0,
    all_reviewed: true,
    next_pending_commit: null,
  });
});

test("multiCommitPlanSummary selects the first pending commit as next_pending_commit", () => {
  const commits = [
    { reviewed: true, sha: "aaa" },
    { reviewed: true, sha: "bbb" },
    { reviewed: false, sha: "ccc" },
    { reviewed: false, sha: "ddd" },
  ];
  assert.deepEqual(multiCommitPlanSummary(commits).next_pending_commit, {
    reviewed: false,
    sha: "ccc",
  });
});

test("multiCommitPlanSummary returns null next_pending_commit when all reviewed", () => {
  const commits = [
    { reviewed: true, sha: "aaa" },
    { reviewed: true, sha: "bbb" },
  ];
  assert.equal(multiCommitPlanSummary(commits).next_pending_commit, null);
});

test("multiCommitPlanStatus returns ready_to_merge when all_reviewed is true", () => {
  const summary = multiCommitPlanSummary([{ reviewed: true }, { reviewed: true }]);
  assert.equal(multiCommitPlanStatus(summary), "ready_to_merge");
});

test("multiCommitPlanStatus returns needs_review when all_reviewed is false", () => {
  const summary = multiCommitPlanSummary([{ reviewed: true }, { reviewed: false }]);
  assert.equal(multiCommitPlanStatus(summary), "needs_review");
});
