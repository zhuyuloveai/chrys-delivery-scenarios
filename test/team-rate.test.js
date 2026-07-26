import test from "node:test"
import assert from "node:assert/strict"
import { teamSuccessRate } from "../src/team-rate.js"

test("teamSuccessRate mixed results", () => {
  const items = [
    { ok: true },
    { ok: false },
    { ok: true },
    null,
    { ok: true },
  ]
  const result = teamSuccessRate(items)
  assert.equal(result.total, 5)
  assert.equal(result.successful, 3)
  assert.equal(result.failed, 2)
  assert.equal(result.rate, 0.6)
})

test("teamSuccessRate all successful", () => {
  const items = [{ ok: true }, { ok: true }, { ok: true }]
  const result = teamSuccessRate(items)
  assert.equal(result.total, 3)
  assert.equal(result.successful, 3)
  assert.equal(result.failed, 0)
  assert.equal(result.rate, 1)
})

test("teamSuccessRate empty array", () => {
  const result = teamSuccessRate([])
  assert.equal(result.total, 0)
  assert.equal(result.successful, 0)
  assert.equal(result.failed, 0)
  assert.equal(result.rate, 0)
})

test("teamSuccessRate non-array input", () => {
  assert.deepEqual(teamSuccessRate(null), { total: 0, successful: 0, failed: 0, rate: 0 })
  assert.deepEqual(teamSuccessRate(undefined), { total: 0, successful: 0, failed: 0, rate: 0 })
  assert.deepEqual(teamSuccessRate("abc"), { total: 0, successful: 0, failed: 0, rate: 0 })
  assert.deepEqual(teamSuccessRate(42), { total: 0, successful: 0, failed: 0, rate: 0 })
})

test("teamSuccessRate null items count as failed", () => {
  const items = [null, null, { ok: true }]
  const result = teamSuccessRate(items)
  assert.equal(result.total, 3)
  assert.equal(result.successful, 1)
  assert.equal(result.failed, 2)
  assert.equal(result.rate, 1 / 3)
})

test("teamSuccessRate all failed", () => {
  const items = [{ ok: false }, { ok: false }, null]
  const result = teamSuccessRate(items)
  assert.equal(result.total, 3)
  assert.equal(result.successful, 0)
  assert.equal(result.failed, 3)
  assert.equal(result.rate, 0)
})
