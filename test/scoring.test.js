import test from "node:test";
import assert from "node:assert/strict";

import { baseScore } from "../src/scoring.js";

test("baseScore sums event points", () => {
  assert.equal(baseScore([{ points: 10 }, { points: 15 }]), 25);
});
