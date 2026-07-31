import test from "node:test";
import assert from "node:assert/strict";
import { incrementalBatchSummary } from "../src/incremental-batch.js";

test("incrementalBatchSummary separates accepted and pending items", () => {
  const summary = incrementalBatchSummary([
    { id: "delivery-1", status: "accepted" },
    { id: "delivery-2", status: "pending" },
    { id: "delivery-3", status: "accepted" },
  ]);

  assert.deepEqual(summary, {
    total: 3,
    accepted: 2,
    pending: 1,
    accepted_ids: ["delivery-1", "delivery-3"],
  });
});
