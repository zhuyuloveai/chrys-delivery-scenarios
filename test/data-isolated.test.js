import test from "node:test";
import assert from "node:assert/strict";
import { dataIsolatedCount } from "../src/data-isolated.js";

test("dataIsolatedCount returns total and valid count for mixed array", () => {
  const items = [
    { valid: true },
    { valid: false },
    { valid: true },
    { name: "no-valid" },
    null,
    { valid: true },
  ];
  assert.deepEqual(dataIsolatedCount(items), { total: 6, valid: 3 });
});

test("dataIsolatedCount returns zeros for empty array", () => {
  assert.deepEqual(dataIsolatedCount([]), { total: 0, valid: 0 });
});

test("dataIsolatedCount returns zeros for null", () => {
  assert.deepEqual(dataIsolatedCount(null), { total: 0, valid: 0 });
});

test("dataIsolatedCount returns zeros for undefined", () => {
  assert.deepEqual(dataIsolatedCount(undefined), { total: 0, valid: 0 });
});

test("dataIsolatedCount returns zeros for non-array input", () => {
  assert.deepEqual(dataIsolatedCount("hello"), { total: 0, valid: 0 });
  assert.deepEqual(dataIsolatedCount(42), { total: 0, valid: 0 });
  assert.deepEqual(dataIsolatedCount({}), { total: 0, valid: 0 });
});
