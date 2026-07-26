import test from "node:test";
import assert from "node:assert/strict";
import { unattributedPolicy } from "../src/unattributed-policy.js";

test("unattributedPolicy counts blocked and ready items", () => {
  const summary = unattributedPolicy([
    { blocked: true },
    { blocked: false },
    { blocked: true },
  ]);

  assert.deepEqual(summary, {
    total_items: 3,
    blocked_items: 2,
    ready_items: 1,
    requires_triage: true,
  });
});

test("unattributedPolicy handles all ready items", () => {
  const summary = unattributedPolicy([{ blocked: false }, {}]);

  assert.equal(summary.total_items, 2);
  assert.equal(summary.blocked_items, 0);
  assert.equal(summary.ready_items, 2);
  assert.equal(summary.requires_triage, false);
});

test("unattributedPolicy treats non-array input as empty", () => {
  assert.deepEqual(unattributedPolicy(undefined), {
    total_items: 0,
    blocked_items: 0,
    ready_items: 0,
    requires_triage: false,
  });
});
