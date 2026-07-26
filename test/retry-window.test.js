import test from "node:test";
import assert from "node:assert/strict";
import { retryWindowSummary } from "../src/retry-window.js";

test("retryWindowSummary counts a mix of successful and failed attempts", () => {
  const attempts = [
    { ok: true },
    { ok: false },
    { ok: true },
    {},
    { ok: false },
  ];

  const summary = retryWindowSummary(attempts);
  assert.equal(summary.total_attempts, 5);
  assert.equal(summary.successful_attempts, 2);
  assert.equal(summary.failed_attempts, 3);
  assert.equal(summary.needs_retry, true);
});

test("retryWindowSummary reports no retry needed when all attempts succeed", () => {
  const attempts = [{ ok: true }, { ok: true }, { ok: true }];

  const summary = retryWindowSummary(attempts);
  assert.equal(summary.total_attempts, 3);
  assert.equal(summary.successful_attempts, 3);
  assert.equal(summary.failed_attempts, 0);
  assert.equal(summary.needs_retry, false);
});

test("retryWindowSummary handles empty input", () => {
  const summary = retryWindowSummary([]);
  assert.equal(summary.total_attempts, 0);
  assert.equal(summary.successful_attempts, 0);
  assert.equal(summary.failed_attempts, 0);
  assert.equal(summary.needs_retry, false);
});
