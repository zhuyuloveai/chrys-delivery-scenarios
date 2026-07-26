import test from "node:test"
import assert from "node:assert/strict"
import { leadCapacity } from "../src/lead-capacity.js"

test("leadCapacity mixed results", () => {
  const items = [
    { active: true },
    { active: false },
    { active: true },
    null,
    { active: true },
  ]
  const result = leadCapacity(items)
  assert.equal(result.total, 5)
  assert.equal(result.active, 3)
  assert.equal(result.inactive, 2)
})

test("leadCapacity all active", () => {
  const items = [{ active: true }, { active: true }]
  const result = leadCapacity(items)
  assert.equal(result.total, 2)
  assert.equal(result.active, 2)
  assert.equal(result.inactive, 0)
})

test("leadCapacity none active", () => {
  const items = [{ active: false }, null, { active: false }]
  const result = leadCapacity(items)
  assert.equal(result.total, 3)
  assert.equal(result.active, 0)
  assert.equal(result.inactive, 3)
})

test("leadCapacity empty array", () => {
  const result = leadCapacity([])
  assert.equal(result.total, 0)
  assert.equal(result.active, 0)
  assert.equal(result.inactive, 0)
})

test("leadCapacity non-array input", () => {
  assert.deepEqual(leadCapacity(null), { total: 0, active: 0, inactive: 0 })
  assert.deepEqual(leadCapacity(undefined), { total: 0, active: 0, inactive: 0 })
  assert.deepEqual(leadCapacity("abc"), { total: 0, active: 0, inactive: 0 })
  assert.deepEqual(leadCapacity(42), { total: 0, active: 0, inactive: 0 })
})
