import test from "node:test";
import assert from "node:assert/strict";
import { unmappedReviewQueue } from "../src/unmapped-review.js";

test("handles empty array", () => {
  assert.deepEqual(unmappedReviewQueue([]), { items: [], count: 0 });
});

test("handles non-array input", () => {
  assert.deepEqual(unmappedReviewQueue(null), { items: [], count: 0 });
  assert.deepEqual(unmappedReviewQueue(undefined), { items: [], count: 0 });
  assert.deepEqual(unmappedReviewQueue("str"), { items: [], count: 0 });
  assert.deepEqual(unmappedReviewQueue(42), { items: [], count: 0 });
});

test("returns empty when all items have department_path", () => {
  const items = [
    { user_id: "a", department_path: ["/org/eng"] },
    { user_id: "b", department_path: ["/org/sales"] },
  ];
  assert.deepEqual(unmappedReviewQueue(items), { items: [], count: 0 });
});

test("retains unmapped items and sorts by user_id", () => {
  const items = [
    { user_id: "z", department_path: ["/org/eng"] },
    { user_id: "b" },
    { user_id: "a" },
    { user_id: "m", department_path: [] },
  ];
  const result = unmappedReviewQueue(items);
  assert.equal(result.count, 3);
  assert.equal(result.items[0].user_id, "a");
  assert.equal(result.items[1].user_id, "b");
  assert.equal(result.items[2].user_id, "m");
});

test("treats missing user_id as empty string for sorting", () => {
  const items = [
    { user_id: "b" },
    {},
    { user_id: "a" },
  ];
  const result = unmappedReviewQueue(items);
  assert.equal(result.count, 3);
  assert.equal(result.items[0].user_id, undefined);
  assert.equal(result.items[1].user_id, "a");
  assert.equal(result.items[2].user_id, "b");
});

test("excludes items with non-empty department_path but keeps unmixed", () => {
  const items = [
    { user_id: "user1" },
    { user_id: "user2", department_path: ["/org/a"] },
    { user_id: "user3", department_path: undefined },
    { user_id: "user4", department_path: [] },
  ];
  const result = unmappedReviewQueue(items);
  assert.equal(result.count, 3);
  assert.equal(result.items[0].user_id, "user1");
  assert.equal(result.items[1].user_id, "user3");
  assert.equal(result.items[2].user_id, "user4");
});
