import test from "node:test";
import assert from "node:assert/strict";

import { summarizeAgentMergeReady } from "../src/agent-merge-ready.js";

test("summarizeAgentMergeReady summarizes a mixed list of checks", () => {
  const checks = [
    { passed: true, name: "lint" },
    { passed: false, name: "build" },
    { passed: true, name: "test" },
    { passed: false, name: "deploy" },
  ];

  assert.deepEqual(summarizeAgentMergeReady(checks), {
    total: 4,
    passed: 2,
    failed: 2,
    ready: false,
    first_failed_name: "build",
  });
});

test("summarizeAgentMergeReady reports ready when every check passes", () => {
  const checks = [
    { passed: true, name: "lint" },
    { passed: true, name: "build" },
    { passed: true, name: "test" },
  ];

  assert.deepEqual(summarizeAgentMergeReady(checks), {
    total: 3,
    passed: 3,
    failed: 0,
    ready: true,
    first_failed_name: null,
  });
});

test("summarizeAgentMergeReady returns zeros and not ready for empty input", () => {
  assert.deepEqual(summarizeAgentMergeReady([]), {
    total: 0,
    passed: 0,
    failed: 0,
    ready: false,
    first_failed_name: null,
  });
});

test("summarizeAgentMergeReady treats non-array input as an empty list", () => {
  assert.deepEqual(summarizeAgentMergeReady(undefined), {
    total: 0,
    passed: 0,
    failed: 0,
    ready: false,
    first_failed_name: null,
  });
  assert.deepEqual(summarizeAgentMergeReady(null), {
    total: 0,
    passed: 0,
    failed: 0,
    ready: false,
    first_failed_name: null,
  });
});

test("summarizeAgentMergeReady counts missing fields as failed", () => {
  const checks = [
    { passed: true, name: "lint" },
    { passed: false, name: "build" },
    { name: "style" },
    { passed: "true" },
  ];

  assert.deepEqual(summarizeAgentMergeReady(checks), {
    total: 4,
    passed: 1,
    failed: 3,
    ready: false,
    first_failed_name: "build",
  });
});

test("summarizeAgentMergeReady reports null when the first failed check has no name", () => {
  const checks = [
    { passed: true, name: "lint" },
    { passed: false },
    { passed: false, name: "deploy" },
  ];

  assert.deepEqual(summarizeAgentMergeReady(checks), {
    total: 3,
    passed: 1,
    failed: 2,
    ready: false,
    first_failed_name: null,
  });
});

test("summarizeAgentMergeReady counts null entries as failed", () => {
  const checks = [
    { passed: true, name: "lint" },
    null,
    { passed: true, name: "test" },
    null,
  ];

  assert.deepEqual(summarizeAgentMergeReady(checks), {
    total: 4,
    passed: 2,
    failed: 2,
    ready: false,
    first_failed_name: null,
  });

  assert.deepEqual(
    summarizeAgentMergeReady([{ passed: false, name: "build" }, null]),
    {
      total: 2,
      passed: 0,
      failed: 2,
      ready: false,
      first_failed_name: "build",
    },
  );
});
