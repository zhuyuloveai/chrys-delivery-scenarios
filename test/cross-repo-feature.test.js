import test from "node:test";
import assert from "node:assert/strict";

import { crossRepoFeatureFlag } from "../src/cross-repo-feature.js";

test("crossRepoFeatureFlag returns enabled string for primary repo role", () => {
  assert.equal(
    crossRepoFeatureFlag("REQ-CROSS-20260723-01", "primary"),
    "REQ-CROSS-20260723-01:primary:enabled",
  );
});
