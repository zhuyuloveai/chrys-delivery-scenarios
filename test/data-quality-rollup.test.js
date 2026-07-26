import test from "node:test";
import assert from "node:assert/strict";

import { dataQualityRollup } from "../src/data-quality-rollup.js";

test("rolls up multiple users across all three statuses", () => {
  const records = [
    { status: "valid", user_id: "ada" },
    { status: "invalid", user_id: "grace" },
    { status: "unmapped", user_id: "nina" },
    { status: "valid", user_id: "leo" },
    { status: "invalid", user_id: "maya" },
  ];

  assert.deepEqual(dataQualityRollup(records), {
    counts: { valid: 2, invalid: 2, unmapped: 1 },
    total: 5,
    invalid_rate: 2 / 5,
    affected_users: ["grace", "maya", "nina"],
  });
});

test("counts unknown statuses as unmapped", () => {
  const records = [
    { status: "valid", user_id: "ada" },
    { status: "weird", user_id: "grace" },
    { status: "missing", user_id: "nina" },
    { status: "invalid", user_id: "leo" },
  ];

  assert.deepEqual(dataQualityRollup(records), {
    counts: { valid: 1, invalid: 1, unmapped: 2 },
    total: 4,
    invalid_rate: 1 / 4,
    affected_users: ["grace", "leo", "nina"],
  });
});

test("deduplicates affected users and sorts them lexicographically", () => {
  const records = [
    { status: "invalid", user_id: "zoe" },
    { status: "invalid", user_id: "ada" },
    { status: "unmapped", user_id: "zoe" },
    { status: "invalid", user_id: "ada" },
    { status: "unmapped", user_id: "amy" },
  ];

  assert.deepEqual(dataQualityRollup(records), {
    counts: { valid: 0, invalid: 3, unmapped: 2 },
    total: 5,
    invalid_rate: 3 / 5,
    affected_users: ["ada", "amy", "zoe"],
  });
});

test("ignores null entries and empty user_ids", () => {
  const records = [
    null,
    { status: "invalid", user_id: "ada" },
    null,
    { status: "unmapped", user_id: "" },
    { status: "invalid", user_id: null },
    { status: "valid", user_id: "leo" },
    null,
  ];

  assert.deepEqual(dataQualityRollup(records), {
    counts: { valid: 1, invalid: 2, unmapped: 1 },
    total: 4,
    invalid_rate: 2 / 4,
    affected_users: ["ada"],
  });
});

test("returns zeros and empty users for empty input", () => {
  assert.deepEqual(dataQualityRollup([]), {
    counts: { valid: 0, invalid: 0, unmapped: 0 },
    total: 0,
    invalid_rate: 0,
    affected_users: [],
  });
});

test("handles a mix of nulls, unknown statuses, duplicates, and empty ids", () => {
  const records = [
    null,
    { status: "valid", user_id: "ada" },
    { status: "bogus", user_id: "grace" },
    { status: "invalid", user_id: "ada" },
    null,
    { status: "unmapped", user_id: "" },
    { status: "unmapped", user_id: "nina" },
    { status: "weird", user_id: "grace" },
    { status: "invalid" },
    { status: "valid", user_id: "leo" },
  ];

  assert.deepEqual(dataQualityRollup(records), {
    counts: { valid: 2, invalid: 2, unmapped: 4 },
    total: 8,
    invalid_rate: 2 / 8,
    affected_users: ["ada", "grace", "nina"],
  });
});
