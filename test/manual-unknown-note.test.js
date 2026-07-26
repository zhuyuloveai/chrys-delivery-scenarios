import test from "node:test";
import assert from "node:assert/strict";
import { manualUnknownNote } from "../src/manual-unknown-note.js";

test("manualUnknownNote counts manual and unresolved notes", () => {
  const summary = manualUnknownNote([
    { source: "manual", resolved: false },
    { source: "agent", resolved: false },
    { source: "manual", resolved: true },
  ]);

  assert.equal(summary.total_notes, 3);
  assert.equal(summary.manual_notes, 2);
  assert.equal(summary.unresolved_notes, 2);
  assert.equal(summary.has_unresolved_manual_note, true);
});

test("manualUnknownNote reports no unresolved manual note when manual notes are resolved", () => {
  const summary = manualUnknownNote([
    { source: "manual", resolved: true },
    { source: "agent", resolved: false },
  ]);

  assert.equal(summary.total_notes, 2);
  assert.equal(summary.manual_notes, 1);
  assert.equal(summary.unresolved_notes, 1);
  assert.equal(summary.has_unresolved_manual_note, false);
});

test("manualUnknownNote treats non-array input as empty", () => {
  const summary = manualUnknownNote(null);

  assert.deepEqual(summary, {
    total_notes: 0,
    manual_notes: 0,
    unresolved_notes: 0,
    has_unresolved_manual_note: false,
  });
});
