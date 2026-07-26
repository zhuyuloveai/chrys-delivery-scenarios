import test from "node:test";
import assert from "node:assert/strict";
import { squashReadinessSummary } from "../src/squash-readiness.js";

test("squashReadinessSummary counts a mix of ready and blocked items", () => {
  const summary = squashReadinessSummary([
    { id: "a", ready: true },
    { id: "b", ready: false },
    { id: "c", ready: true },
  ]);

  assert.deepEqual(summary, {
    total_items: 3,
    ready_items: 2,
    blocked_items: 1,
    ready_to_squash: false,
    next_blocked_item: { id: "b", ready: false },
  });
});

test("squashReadinessSummary is ready to squash when all items are ready", () => {
  const summary = squashReadinessSummary([
    { id: "a", ready: true },
    { id: "b", ready: true },
  ]);

  assert.deepEqual(summary, {
    total_items: 2,
    ready_items: 2,
    blocked_items: 0,
    ready_to_squash: true,
    next_blocked_item: null,
  });
});

test("squashReadinessSummary returns zeros and not ready for empty input", () => {
  assert.deepEqual(squashReadinessSummary([]), {
    total_items: 0,
    ready_items: 0,
    blocked_items: 0,
    ready_to_squash: false,
    next_blocked_item: null,
  });
});

test("squashReadinessSummary treats non-array input as empty", () => {
  for (const input of [null, undefined, {}, 42, "nope"]) {
    assert.deepEqual(squashReadinessSummary(input), {
      total_items: 0,
      ready_items: 0,
      blocked_items: 0,
      ready_to_squash: false,
      next_blocked_item: null,
    });
  }
});

test("squashReadinessSummary only treats strict ready === true as ready", () => {
  const summary = squashReadinessSummary([
    { id: "a", ready: true },
    { id: "b", ready: 1 },
    { id: "c" },
    { id: "d", ready: "true" },
    { id: "e", ready: null },
  ]);

  assert.equal(summary.total_items, 5);
  assert.equal(summary.ready_items, 1);
  assert.equal(summary.blocked_items, 4);
  assert.equal(summary.ready_to_squash, false);
  assert.deepEqual(summary.next_blocked_item, { id: "b", ready: 1 });
});

test("squashReadinessSummary reports the first blocked item even when some are ready", () => {
  const firstBlocked = { id: "x", ready: false };
  const summary = squashReadinessSummary([
    { id: "a", ready: true },
    firstBlocked,
    { id: "b", ready: false },
  ]);

  assert.equal(summary.next_blocked_item, firstBlocked);
});
