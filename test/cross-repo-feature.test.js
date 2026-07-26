import test from "node:test";
import assert from "node:assert/strict";

import {
  crossRepoFeatureFlag,
  crossRepoRolloutSummary,
} from "../src/cross-repo-feature.js";

test("crossRepoFeatureFlag returns enabled string for primary repo role", () => {
  assert.equal(
    crossRepoFeatureFlag("REQ-CROSS-20260723-01", "primary"),
    "REQ-CROSS-20260723-01:primary:enabled",
  );
});

test("crossRepoRolloutSummary reports enabled when enabled is true", () => {
  const requirementId = "REQ-CROSS-20260723-01";
  const repoRole = "primary";
  const summary = crossRepoRolloutSummary(requirementId, repoRole, true);
  assert.equal(summary.requirement_id, requirementId);
  assert.equal(summary.repo_role, repoRole);
  assert.equal(summary.flag, crossRepoFeatureFlag(requirementId, repoRole));
  assert.equal(summary.rollout_state, "enabled");
});

test("crossRepoRolloutSummary reports disabled when enabled is false", () => {
  const requirementId = "REQ-CROSS-20260723-02";
  const repoRole = "secondary";
  const summary = crossRepoRolloutSummary(requirementId, repoRole, false);
  assert.equal(summary.requirement_id, requirementId);
  assert.equal(summary.repo_role, repoRole);
  assert.equal(summary.flag, `${requirementId}:${repoRole}:disabled`);
  assert.equal(summary.rollout_state, "disabled");
});
