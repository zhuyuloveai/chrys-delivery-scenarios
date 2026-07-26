import test from "node:test";
import assert from "node:assert/strict";
import { summarizeSalesWindow } from "../src/sales-window.js";

test("summarizeSalesWindow counts a mix of won, lost, open, and null stage items", () => {
  const items = [
    { stage: "won" },
    { stage: "lost" },
    { stage: "open" },
    { stage: null },
    { stage: "won" },
    {},
  ];

  const summary = summarizeSalesWindow(items);
  assert.equal(summary.opportunities, 6);
  assert.equal(summary.won, 2);
  assert.equal(summary.lost, 1);
  assert.equal(summary.open, 3);
  assert.equal(summary.win_rate, 2 / 3);
});

test("summarizeSalesWindow handles only open items", () => {
  const items = [
    { stage: "discovery" },
    { stage: "proposal" },
    { stage: null },
    {},
  ];

  const summary = summarizeSalesWindow(items);
  assert.equal(summary.opportunities, 4);
  assert.equal(summary.won, 0);
  assert.equal(summary.lost, 0);
  assert.equal(summary.open, 4);
  assert.equal(summary.win_rate, 0);
});

test("summarizeSalesWindow handles empty input", () => {
  const summary = summarizeSalesWindow([]);
  assert.equal(summary.opportunities, 0);
  assert.equal(summary.won, 0);
  assert.equal(summary.lost, 0);
  assert.equal(summary.open, 0);
  assert.equal(summary.win_rate, 0);
});

test("summarizeSalesWindow handles non-array input", () => {
  const summary = summarizeSalesWindow(undefined);
  assert.equal(summary.opportunities, 0);
  assert.equal(summary.won, 0);
  assert.equal(summary.lost, 0);
  assert.equal(summary.open, 0);
  assert.equal(summary.win_rate, 0);
});
