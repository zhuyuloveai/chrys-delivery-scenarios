import test from "node:test";
import assert from "node:assert/strict";
import { multiCommitPlanSummary } from "../src/multi-commit-plan.js";

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
  });
});

test("multiCommitPlanSummary reports all_reviewed when every commit is reviewed", () => {
  const commits = [{ reviewed: true }, { reviewed: true }, { reviewed: true }];
  assert.deepEqual(multiCommitPlanSummary(commits), {
    total_commits: 3,
    reviewed_commits: 3,
    pending_commits: 0,
    all_reviewed: true,
  });
});

test("multiCommitPlanSummary handles empty input", () => {
  assert.deepEqual(multiCommitPlanSummary([]), {
    total_commits: 0,
    reviewed_commits: 0,
    pending_commits: 0,
    all_reviewed: true,
  });
});
