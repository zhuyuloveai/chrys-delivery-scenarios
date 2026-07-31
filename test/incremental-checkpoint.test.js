import test from "node:test";
import assert from "node:assert/strict";
import { latestIncrementalCheckpoint } from "../src/incremental-checkpoint.js";

test("latestIncrementalCheckpoint selects the newest observation", () => {
  const latest = latestIncrementalCheckpoint([
    { id: "checkpoint-1", observed_at: "2026-07-31T02:20:00Z" },
    { id: "checkpoint-3", observed_at: "2026-07-31T04:20:00Z" },
    { id: "checkpoint-2", observed_at: "2026-07-31T03:20:00Z" },
  ]);

  assert.equal(latest.id, "checkpoint-3");
});

test("latestIncrementalCheckpoint returns null for no checkpoints", () => {
  assert.equal(latestIncrementalCheckpoint([]), null);
});
