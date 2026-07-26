import test from "node:test";
import assert from "node:assert/strict";

import { agentOwnedSignal } from "../src/agent-owned-signal.js";

test("agentOwnedSignal sets needs_review true for high severity event", () => {
  const events = [
    { actor: "agent", severity: "high" },
    { actor: "user", severity: "low" },
  ];
  assert.deepEqual(agentOwnedSignal(events), {
    total_events: 2,
    agent_events: 1,
    needs_review: true,
  });
});

test("agentOwnedSignal counts only actor equal to agent", () => {
  const events = [
    { actor: "agent", severity: "low" },
    { actor: "agent", severity: "medium" },
    { actor: "bot", severity: "low" },
    { actor: "user", severity: "low" },
  ];
  assert.deepEqual(agentOwnedSignal(events), {
    total_events: 4,
    agent_events: 2,
    needs_review: false,
  });
});

test("agentOwnedSignal treats empty array as no events", () => {
  assert.deepEqual(agentOwnedSignal([]), {
    total_events: 0,
    agent_events: 0,
    needs_review: false,
  });
});

test("agentOwnedSignal treats non-array input as empty array", () => {
  assert.deepEqual(agentOwnedSignal(null), {
    total_events: 0,
    agent_events: 0,
    needs_review: false,
  });
  assert.deepEqual(agentOwnedSignal(undefined), {
    total_events: 0,
    agent_events: 0,
    needs_review: false,
  });
  assert.deepEqual(agentOwnedSignal("not-an-array"), {
    total_events: 0,
    agent_events: 0,
    needs_review: false,
  });
});

test("agentOwnedSignal does not flag review for non-high severities", () => {
  const events = [
    { actor: "user", severity: "low" },
    { actor: "agent", severity: "medium" },
  ];
  assert.equal(agentOwnedSignal(events).needs_review, false);
});
