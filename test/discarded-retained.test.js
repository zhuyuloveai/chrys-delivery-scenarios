import test from "node:test";
import assert from "node:assert/strict";

import { retainedSignalSummary } from "../src/discarded-retained.js";

test("retainedSignalSummary mixes retained and discarded items", () => {
  const items = [
    { id: "a", retained: true },
    { id: "b", retained: false },
    { id: "c", retained: true },
    { id: "d", retained: false },
  ];
  assert.deepEqual(retainedSignalSummary(items), {
    total_items: 4,
    retained_items: 2,
    discarded_items: 2,
    retained_ratio: 0.5,
    first_retained_item: { id: "a", retained: true },
  });
});

test("retainedSignalSummary handles all retained items", () => {
  const items = [
    { id: "a", retained: true },
    { id: "b", retained: true },
  ];
  assert.deepEqual(retainedSignalSummary(items), {
    total_items: 2,
    retained_items: 2,
    discarded_items: 0,
    retained_ratio: 1,
    first_retained_item: { id: "a", retained: true },
  });
});

test("retainedSignalSummary handles all discarded items", () => {
  const items = [
    { id: "a", retained: false },
    { id: "b", retained: false },
  ];
  assert.deepEqual(retainedSignalSummary(items), {
    total_items: 2,
    retained_items: 0,
    discarded_items: 2,
    retained_ratio: 0,
    first_retained_item: null,
  });
});

test("retainedSignalSummary returns zeroed summary for empty array", () => {
  assert.deepEqual(retainedSignalSummary([]), {
    total_items: 0,
    retained_items: 0,
    discarded_items: 0,
    retained_ratio: 0,
    first_retained_item: null,
  });
});

test("retainedSignalSummary treats non-array input as empty array", () => {
  assert.deepEqual(retainedSignalSummary(null), {
    total_items: 0,
    retained_items: 0,
    discarded_items: 0,
    retained_ratio: 0,
    first_retained_item: null,
  });
  assert.deepEqual(retainedSignalSummary(undefined), {
    total_items: 0,
    retained_items: 0,
    discarded_items: 0,
    retained_ratio: 0,
    first_retained_item: null,
  });
  assert.deepEqual(retainedSignalSummary("not an array"), {
    total_items: 0,
    retained_items: 0,
    discarded_items: 0,
    retained_ratio: 0,
    first_retained_item: null,
  });
  assert.deepEqual(retainedSignalSummary({ retained: true }), {
    total_items: 0,
    retained_items: 0,
    discarded_items: 0,
    retained_ratio: 0,
    first_retained_item: null,
  });
});

test("retainedSignalSummary counts only strict retained === true", () => {
  const items = [
    { id: "truthy-string", retained: "true" },
    { id: "one", retained: 1 },
    { id: "object", retained: {} },
    { id: "truthy-nonempty", retained: "yes" },
    { id: "undefined-field" },
    { id: "null-field", retained: null },
    { id: "strict-true", retained: true },
  ];
  assert.deepEqual(retainedSignalSummary(items), {
    total_items: 7,
    retained_items: 1,
    discarded_items: 6,
    retained_ratio: 1 / 7,
    first_retained_item: { id: "strict-true", retained: true },
  });
});

test("retainedSignalSummary first_retained_item references the original item", () => {
  const first = { id: "first", retained: true };
  const items = [
    { id: "discarded", retained: false },
    first,
    { id: "later", retained: true },
  ];
  const result = retainedSignalSummary(items);
  assert.equal(result.first_retained_item, first);
  assert.deepEqual(result.first_retained_item, first);
});
