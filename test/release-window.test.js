import test from "node:test";
import assert from "node:assert/strict";
import {
  releaseWindowStatus,
  releaseWindowSummary,
} from "../src/release-window.js";

test("releaseWindowStatus returns scheduled before the window starts", () => {
  const window = {
    started_at: "2026-01-10T00:00:00Z",
    ended_at: "2026-01-20T00:00:00Z",
    now: "2026-01-05T00:00:00Z",
  };
  assert.equal(releaseWindowStatus(window), "scheduled");
});

test("releaseWindowStatus returns open during the window", () => {
  const window = {
    started_at: "2026-01-10T00:00:00Z",
    ended_at: "2026-01-20T00:00:00Z",
    now: "2026-01-15T00:00:00Z",
  };
  assert.equal(releaseWindowStatus(window), "open");
});

test("releaseWindowStatus returns closed after the window ends", () => {
  const window = {
    started_at: "2026-01-10T00:00:00Z",
    ended_at: "2026-01-20T00:00:00Z",
    now: "2026-01-25T00:00:00Z",
  };
  assert.equal(releaseWindowStatus(window), "closed");
});

test("releaseWindowStatus treats now equal to started_at as open", () => {
  const window = {
    started_at: "2026-01-10T00:00:00Z",
    ended_at: "2026-01-20T00:00:00Z",
    now: new Date("2026-01-10T00:00:00Z"),
  };
  assert.equal(releaseWindowStatus(window), "open");
});

test("releaseWindowStatus treats now equal to ended_at as open", () => {
  const window = {
    started_at: new Date("2026-01-10T00:00:00Z"),
    ended_at: new Date("2026-01-20T00:00:00Z"),
    now: "2026-01-20T00:00:00Z",
  };
  assert.equal(releaseWindowStatus(window), "open");
});

test("releaseWindowSummary exposes status and is_open for each state", () => {
  const window = {
    started_at: "2026-01-10T00:00:00Z",
    ended_at: "2026-01-20T00:00:00Z",
  };

  const scheduled = releaseWindowSummary({ ...window, now: "2026-01-05T00:00:00Z" });
  assert.equal(scheduled.status, "scheduled");
  assert.equal(scheduled.is_open, false);
  assert.equal(scheduled.started_at, window.started_at);
  assert.equal(scheduled.ended_at, window.ended_at);

  const open = releaseWindowSummary({ ...window, now: "2026-01-15T00:00:00Z" });
  assert.equal(open.status, "open");
  assert.equal(open.is_open, true);

  const closed = releaseWindowSummary({ ...window, now: "2026-01-25T00:00:00Z" });
  assert.equal(closed.status, "closed");
  assert.equal(closed.is_open, false);
});
