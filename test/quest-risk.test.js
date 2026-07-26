import test from "node:test";
import assert from "node:assert/strict";
import { questRiskLevel, questRiskSummary } from "../src/quest-risk.js";

test("questRiskLevel returns low for danger 0", () => {
  assert.equal(questRiskLevel({ danger: 0 }), "low");
});

test("questRiskLevel returns low for danger 3", () => {
  assert.equal(questRiskLevel({ danger: 3 }), "low");
});

test("questRiskLevel returns medium for danger 4", () => {
  assert.equal(questRiskLevel({ danger: 4 }), "medium");
});

test("questRiskLevel returns medium for danger 7", () => {
  assert.equal(questRiskLevel({ danger: 7 }), "medium");
});

test("questRiskLevel returns high for danger 8", () => {
  assert.equal(questRiskLevel({ danger: 8 }), "high");
});

test("questRiskLevel returns high for danger 9", () => {
  assert.equal(questRiskLevel({ danger: 9 }), "high");
});

test("questRiskLevel returns high for danger 10", () => {
  assert.equal(questRiskLevel({ danger: 10 }), "high");
});

test("questRiskSummary returns a low summary for low danger", () => {
  assert.deepEqual(questRiskSummary({ danger: 2 }), {
    danger: 2,
    level: "low",
    requires_review: false,
  });
});

test("questRiskSummary returns a high summary for high danger", () => {
  assert.deepEqual(questRiskSummary({ danger: 9 }), {
    danger: 9,
    level: "high",
    requires_review: true,
  });
});
