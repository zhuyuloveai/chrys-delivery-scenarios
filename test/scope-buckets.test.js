import test from "node:test";
import assert from "node:assert/strict";

import { classifyActorBuckets } from "../src/scope-buckets.js";

test("classifyActorBuckets counts people and service accounts, remaps unknown to unmapped", () => {
  const items = [
    { actor_type: "person" },
    { actor_type: "service" },
    { actor_type: "person" },
    { actor_type: "unknown" },
    { actor_type: "service" },
  ];

  assert.deepEqual(classifyActorBuckets(items), {
    people: 2,
    service_accounts: 2,
    unmapped: 1,
    total: 5,
  });
});

test("classifyActorBuckets treats null items as unmapped", () => {
  const items = [
    { actor_type: "person" },
    null,
    { actor_type: "service" },
    null,
    null,
  ];

  assert.deepEqual(classifyActorBuckets(items), {
    people: 1,
    service_accounts: 1,
    unmapped: 3,
    total: 5,
  });
});

test("classifyActorBuckets returns all zeros for empty array", () => {
  assert.deepEqual(classifyActorBuckets([]), {
    people: 0,
    service_accounts: 0,
    unmapped: 0,
    total: 0,
  });
});

test("classifyActorBuckets returns all zeros for non-array input", () => {
  assert.deepEqual(classifyActorBuckets(null), {
    people: 0,
    service_accounts: 0,
    unmapped: 0,
    total: 0,
  });

  assert.deepEqual(classifyActorBuckets(undefined), {
    people: 0,
    service_accounts: 0,
    unmapped: 0,
    total: 0,
  });

  assert.deepEqual(classifyActorBuckets({}), {
    people: 0,
    service_accounts: 0,
    unmapped: 0,
    total: 0,
  });
});

test("classifyActorBuckets treats missing actor_type as unmapped", () => {
  const items = [{ actor_type: "person" }, {}, { actor_type: "service" }];

  assert.deepEqual(classifyActorBuckets(items), {
    people: 1,
    service_accounts: 1,
    unmapped: 1,
    total: 3,
  });
});
