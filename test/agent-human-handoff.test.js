import test from "node:test";
import assert from "node:assert/strict";
import { summarizeHandoffParticipation } from "../src/agent-human-handoff.js";

test("summarizeHandoffParticipation counts mixed agent and human entries", () => {
  const entries = [
    { actor: "agent", id: 1 },
    { actor: "human", id: 2 },
    { actor: "agent", id: 3 },
  ];
  const summary = summarizeHandoffParticipation(entries);
  assert.deepEqual(summary, {
    total: 3,
    agent_entries: 2,
    human_entries: 1,
    mixed: true,
    manual_review_required: true,
  });
});

test("agent-only entries are not mixed", () => {
  const summary = summarizeHandoffParticipation([{ actor: "agent" }, { actor: "agent" }]);
  assert.equal(summary.total, 2);
  assert.equal(summary.agent_entries, 2);
  assert.equal(summary.human_entries, 0);
  assert.equal(summary.mixed, false);
  assert.equal(summary.manual_review_required, false);
});

test("human-only entries are not mixed", () => {
  const summary = summarizeHandoffParticipation([{ actor: "human" }]);
  assert.equal(summary.total, 1);
  assert.equal(summary.agent_entries, 0);
  assert.equal(summary.human_entries, 1);
  assert.equal(summary.mixed, false);
  assert.equal(summary.manual_review_required, true);
});

test("other actors count only toward total", () => {
  const summary = summarizeHandoffParticipation([
    { actor: "agent" },
    { actor: "reviewer" },
    { actor: "bot" },
  ]);
  assert.deepEqual(summary, {
    total: 3,
    agent_entries: 1,
    human_entries: 0,
    mixed: false,
    manual_review_required: false,
  });
});

test("other actors alongside agent and human do not affect mixed flag", () => {
  const summary = summarizeHandoffParticipation([
    { actor: "agent" },
    { actor: "human" },
    { actor: "reviewer" },
  ]);
  assert.deepEqual(summary, {
    total: 3,
    agent_entries: 1,
    human_entries: 1,
    mixed: true,
    manual_review_required: true,
  });
});

test("empty array has zero counts and is not mixed", () => {
  const summary = summarizeHandoffParticipation([]);
  assert.deepEqual(summary, {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
    manual_review_required: false,
  });
});

test("non-array input is treated as empty array", () => {
  const summary = summarizeHandoffParticipation(null);
  assert.deepEqual(summary, {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
    manual_review_required: false,
  });
});

test("non-array object input is treated as empty array", () => {
  const summary = summarizeHandoffParticipation({ actor: "agent" });
  assert.deepEqual(summary, {
    total: 0,
    agent_entries: 0,
    human_entries: 0,
    mixed: false,
    manual_review_required: false,
  });
});

test("only strict actor equal to agent or human counts", () => {
  const entries = [
    { actor: "agent" },
    { actor: "human" },
    { actor: "Agent" },
    { actor: "HUMAN" },
    { actor: " agent " },
    { actor: 1 },
    {},
    { actor: null },
    { actor: undefined },
  ];
  const summary = summarizeHandoffParticipation(entries);
  assert.equal(summary.total, 9);
  assert.equal(summary.agent_entries, 1);
  assert.equal(summary.human_entries, 1);
  assert.equal(summary.mixed, true);
  assert.equal(summary.manual_review_required, true);
});
