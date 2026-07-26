import test from "node:test";
import assert from "node:assert/strict";

import { summarizeServiceActivity } from "../src/service-activity.js";

test("summarizeServiceActivity counts automated, manual, and command names", () => {
  const events = [
    { command: "deploy", automated: true },
    { command: "build", automated: false },
    { command: "rollback", automated: true },
    { command: "test", automated: true },
    { command: "deploy", automated: true },
  ];
  assert.deepEqual(summarizeServiceActivity(events), {
    total: 5,
    automated: 4,
    manual: 1,
    command_names: ["build", "deploy", "rollback", "test"],
  });
});

test("summarizeServiceActivity treats null automated as manual and excludes empty command", () => {
  const events = [
    { command: "deploy", automated: true },
    { command: "", automated: false },
    { command: "rollback", automated: null },
    { command: "build" },
  ];
  assert.deepEqual(summarizeServiceActivity(events), {
    total: 4,
    automated: 1,
    manual: 3,
    command_names: ["build", "deploy", "rollback"],
  });
});

test("summarizeServiceActivity deduplicates command names and sorts lexicographically", () => {
  const events = [
    { command: "z", automated: true },
    { command: "a", automated: false },
    { command: "m", automated: true },
    { command: "a", automated: false },
    { command: "z", automated: true },
  ];
  assert.deepEqual(summarizeServiceActivity(events), {
    total: 5,
    automated: 3,
    manual: 2,
    command_names: ["a", "m", "z"],
  });
});

test("summarizeServiceActivity treats non-array input as empty", () => {
  assert.deepEqual(summarizeServiceActivity(null), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
  assert.deepEqual(summarizeServiceActivity(undefined), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
  assert.deepEqual(summarizeServiceActivity("string"), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
  assert.deepEqual(summarizeServiceActivity({}), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
  assert.deepEqual(summarizeServiceActivity(42), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
});

test("summarizeServiceActivity handles empty array", () => {
  assert.deepEqual(summarizeServiceActivity([]), {
    total: 0, automated: 0, manual: 0, command_names: [],
  });
});
