import test from "node:test";
import assert from "node:assert/strict";
import {
  mainIterationSummary,
  mainIterationLabel,
} from "../src/main-iteration.js";

test("mainIterationSummary counts mixed done and open entries", () => {
  const entries = [
    { status: "done" },
    { status: "open" },
    { status: "done" },
    { status: "open" },
  ];
  assert.deepEqual(mainIterationSummary(entries), {
    total_entries: 4,
    completed_entries: 2,
    open_entries: 2,
    all_done: false,
    next_open_entry: { status: "open" },
  });
});

test("mainIterationSummary reports all_done when every entry is done", () => {
  const entries = [
    { status: "done" },
    { status: "done" },
    { status: "done" },
  ];
  assert.deepEqual(mainIterationSummary(entries), {
    total_entries: 3,
    completed_entries: 3,
    open_entries: 0,
    all_done: true,
    next_open_entry: null,
  });
});

test("mainIterationSummary handles empty input", () => {
  assert.deepEqual(mainIterationSummary([]), {
    total_entries: 0,
    completed_entries: 0,
    open_entries: 0,
    all_done: false,
    next_open_entry: null,
  });
});

test("mainIterationSummary selects the first non-done entry as next_open_entry", () => {
  const entries = [
    { status: "done" },
    { status: "in-progress", id: "a" },
    { status: "open", id: "b" },
  ];
  assert.deepEqual(mainIterationSummary(entries).next_open_entry, {
    status: "in-progress",
    id: "a",
  });
});

test("mainIterationSummary returns null next_open_entry when all done", () => {
  const entries = [{ status: "done" }, { status: "done" }];
  assert.equal(mainIterationSummary(entries).next_open_entry, null);
});

test("mainIterationLabel returns done when all_done is true", () => {
  assert.equal(
    mainIterationLabel({
      total_entries: 2,
      completed_entries: 2,
      open_entries: 0,
      all_done: true,
      next_open_entry: null,
    }),
    "done"
  );
});

test("mainIterationLabel returns active when all_done is false", () => {
  assert.equal(
    mainIterationLabel({
      total_entries: 2,
      completed_entries: 1,
      open_entries: 1,
      all_done: false,
      next_open_entry: { status: "open" },
    }),
    "active"
  );
});
