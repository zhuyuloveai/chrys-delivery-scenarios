import test from "node:test";
import assert from "node:assert/strict";
import { unknownPolicySummary } from "../src/unknown-policy.js";

test("unknownPolicySummary counts mixed unresolved and resolved items", () => {
  const first = { id: "a", resolved: false };
  const summary = unknownPolicySummary([
    first,
    { id: "b", resolved: true },
    { id: "c" },
  ]);

  assert.deepEqual(summary, {
    total_items: 3,
    unresolved_items: 2,
    resolved_items: 1,
    has_unknown_work: true,
    first_unresolved_item: first,
  });
});

test("unknownPolicySummary reports no unknown work when all items are resolved", () => {
  assert.deepEqual(
    unknownPolicySummary([
      { id: "a", resolved: true },
      { id: "b", resolved: true },
    ]),
    {
      total_items: 2,
      unresolved_items: 0,
      resolved_items: 2,
      has_unknown_work: false,
      first_unresolved_item: null,
    },
  );
});

test("unknownPolicySummary treats non-array input as empty", () => {
  for (const input of [null, undefined, {}, 42, "nope"]) {
    assert.deepEqual(unknownPolicySummary(input), {
      total_items: 0,
      unresolved_items: 0,
      resolved_items: 0,
      has_unknown_work: false,
      first_unresolved_item: null,
    });
  }
});

test("unknownPolicySummary only treats strict resolved === true as resolved", () => {
  const summary = unknownPolicySummary([
    { id: "a", resolved: true },
    { id: "b", resolved: 1 },
    { id: "c", resolved: "true" },
    { id: "d", resolved: null },
  ]);

  assert.equal(summary.total_items, 4);
  assert.equal(summary.unresolved_items, 3);
  assert.equal(summary.resolved_items, 1);
  assert.equal(summary.has_unknown_work, true);
  assert.deepEqual(summary.first_unresolved_item, { id: "b", resolved: 1 });
}
);
