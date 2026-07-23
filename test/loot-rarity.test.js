import test from "node:test";
import assert from "node:assert/strict";
import { lootRarity } from "../src/loot-rarity.js";

test("lootRarity returns mythic for dropRate 0.01", () => {
  assert.equal(lootRarity(0.01), "mythic");
});

test("lootRarity returns mythic for dropRate 0.001", () => {
  assert.equal(lootRarity(0.001), "mythic");
});

test("lootRarity returns epic for dropRate 0.05", () => {
  assert.equal(lootRarity(0.05), "epic");
});

test("lootRarity returns epic for dropRate 0.02", () => {
  assert.equal(lootRarity(0.02), "epic");
});

test("lootRarity returns rare for dropRate 0.2", () => {
  assert.equal(lootRarity(0.2), "rare");
});

test("lootRarity returns rare for dropRate 0.1", () => {
  assert.equal(lootRarity(0.1), "rare");
});

test("lootRarity returns common for dropRate 0.5", () => {
  assert.equal(lootRarity(0.5), "common");
});

test("lootRarity returns common for dropRate 0.99", () => {
  assert.equal(lootRarity(0.99), "common");
});
