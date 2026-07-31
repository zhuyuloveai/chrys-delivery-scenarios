import test from "node:test";
import assert from "node:assert/strict";
import { incrementalReviewQueue } from "../src/incremental-review.js";

test("incrementalReviewQueue returns only changes awaiting review", () => {
  assert.deepEqual(
    incrementalReviewQueue([
      { id: "change-1", reviewed: true, priority: "high" },
      { id: "change-2", reviewed: false, priority: "high" },
      { id: "change-3" },
    ]),
    [
      { id: "change-2", priority: "high" },
      { id: "change-3", priority: "normal" },
    ],
  );
});
