import test from "node:test";
import assert from "node:assert/strict";

import { summarizeHandoffParticipation } from "../src/agent-human-handoff.js";

test("counts agent and human entries and reports mixed participation", () => {
  const entries = [
    { actor: "agent", id: 1 },
    { actor: "human", id: 2 },
    { actor: "agent", id: 3 },
    { actor: "human", id: 4 },
  ];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 4,
    agent_entries: 2,
    human_entries: 2,
    mixed: true,
  });
});

test("agent-only entries are not mixed", () => {
  const entries = [{ actor: "agent" }, { actor: "agent" }];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 2,
    agent_entries: 2,
    human_entries: 0,
    mixed: false,
  });
});

test("human-only entries are not mixed", () => {
  const entries = [{ actor: "human" }];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 1,
    agent_entries: 0,
    human_entries: 1,
    mixed: false,
  });
});

test("manual review metadata remains a human contribution", () => {
  const entries = [{ actor: "human", name: "Release Reviewer", source: "manual-review" }];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 1,
    agent_entries: 0,
    human_entries: 1,
    mixed: false,
  });
});
test("other actors count only toward total", () => {
  const entries = [
    { actor: "agent" },
    { actor: "human" },
    { actor: "system" },
    { actor: "reviewer" },
    {},
    { actor: "AGENT" },
    { actor: 123 },
  ];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 7,
    agent_entries: 1,
    human_entries: 1,
    mixed: true,
  });
});

test("other actors alone are not mixed", () => {
  const entries = [{ actor: "system" }, { actor: "bot" }, {}];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 3,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
  });
});

test("mixed stays true when other actors are present", () => {
  const entries = [
    { actor: "agent" },
    { actor: "human" },
    { actor: "system" },
  ];

  const summary = summarizeHandoffParticipation(entries);
  assert.equal(summary.total, 3);
  assert.equal(summary.agent_entries, 1);
  assert.equal(summary.human_entries, 1);
  assert.equal(summary.mixed, true);
});

test("skips null entries", () => {
  const entries = [
    null,
    { actor: "agent" },
    null,
    { actor: "human" },
    undefined,
  ];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 2,
    agent_entries: 1,
    human_entries: 1,
    mixed: true,
  });
});

test("ignores human entries whose name is blank and keeps output deterministic", () => {
  const entries = [
    { actor: "human", name: "" },
    { actor: "human", name: "   " },
    { actor: "human", name: "\t" },
  ];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
  });
});

test("ignores only blank-name human entries and keeps the rest", () => {
  const entries = [
    { actor: "human", name: "Alice Chen" },
    { actor: "human", name: "  " },
    { actor: "agent", name: "claude" },
    { actor: "human" },
  ];

  assert.deepEqual(summarizeHandoffParticipation(entries), {
    total: 3,
    agent_entries: 1,
    human_entries: 2,
    mixed: true,
  });
});

test("returns zeros for empty input", () => {
  assert.deepEqual(summarizeHandoffParticipation([]), {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
  });
});

test("returns zeros for non-array input", () => {
  assert.deepEqual(summarizeHandoffParticipation(null), {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
  });
});

test("returns zeros for non-array object input", () => {
  assert.deepEqual(summarizeHandoffParticipation({ actor: "agent" }), {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
  });
});
