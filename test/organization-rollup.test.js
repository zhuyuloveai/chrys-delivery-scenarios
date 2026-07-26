import test from "node:test";
import assert from "node:assert/strict";

import { summarizeOrganizationContributions } from "../src/organization-rollup.js";

test("summarizes two departments with multiple users each", () => {
  const entries = [
    { department: "Engineering", user: "ada", session_count: 3, commit_count: 10, agent_lines: 120 },
    { department: "Engineering", user: "grace", session_count: 2, commit_count: 5, agent_lines: 80 },
    { department: "Design", user: "nina", session_count: 4, commit_count: 1, agent_lines: 50 },
    { department: "Design", user: "leo", session_count: 1, commit_count: 2, agent_lines: 30 },
  ];

  assert.deepEqual(summarizeOrganizationContributions(entries), {
    departments: [
      { department: "Design", session_count: 5, commit_count: 3, agent_lines: 80 },
      { department: "Engineering", session_count: 5, commit_count: 15, agent_lines: 200 },
    ],
    totals: { session_count: 10, commit_count: 18, agent_lines: 280 },
  });
});

test("returns empty departments and zero totals for empty input", () => {
  assert.deepEqual(summarizeOrganizationContributions([]), {
    departments: [],
    totals: { session_count: 0, commit_count: 0, agent_lines: 0 },
  });
});

test("ignores null entries", () => {
  const entries = [
    null,
    { department: "Engineering", session_count: 2, commit_count: 4, agent_lines: 40 },
    null,
    { department: "Engineering", session_count: 1, commit_count: 1, agent_lines: 10 },
    null,
  ];

  assert.deepEqual(summarizeOrganizationContributions(entries), {
    departments: [
      { department: "Engineering", session_count: 3, commit_count: 5, agent_lines: 50 },
    ],
    totals: { session_count: 3, commit_count: 5, agent_lines: 50 },
  });
});

test("treats missing numeric fields as 0", () => {
  const entries = [
    { department: "Engineering", commit_count: 2 },
    { department: "Design", session_count: 5 },
    { department: "Engineering", agent_lines: 25 },
  ];

  assert.deepEqual(summarizeOrganizationContributions(entries), {
    departments: [
      { department: "Design", session_count: 5, commit_count: 0, agent_lines: 0 },
      { department: "Engineering", session_count: 0, commit_count: 2, agent_lines: 25 },
    ],
    totals: { session_count: 5, commit_count: 2, agent_lines: 25 },
  });
});

test("combines null entries and missing fields with three departments", () => {
  const entries = [
    null,
    { department: "Ops", session_count: 1, commit_count: 1, agent_lines: 5 },
    { department: "Engineering", commit_count: 3 },
    null,
    { department: "Ops", agent_lines: 15 },
    { department: "Design", session_count: 2, commit_count: 4, agent_lines: 60 },
    null,
    { department: "Engineering", session_count: 7, agent_lines: 90 },
  ];

  assert.deepEqual(summarizeOrganizationContributions(entries), {
    departments: [
      { department: "Design", session_count: 2, commit_count: 4, agent_lines: 60 },
      { department: "Engineering", session_count: 7, commit_count: 3, agent_lines: 90 },
      { department: "Ops", session_count: 1, commit_count: 1, agent_lines: 20 },
    ],
    totals: { session_count: 10, commit_count: 8, agent_lines: 170 },
  });
});
