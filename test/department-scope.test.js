import test from "node:test";
import assert from "node:assert/strict";

import { departmentScopeSummary } from "../src/department-scope.js";

test("counts direct entries and subtree entries together", () => {
  const entries = [
    { department_path: ["Engineering", "Platform"], user: "ada" },
    { department_path: ["Engineering", "Platform", "Web"], user: "grace" },
    { department_path: ["Engineering", "Platform", "Mobile"], user: "nina" },
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering", "Platform"]), {
    direct_count: 1,
    total_count: 3,
    distinct_users: ["ada", "grace", "nina"],
  });
});

test("distinguishes direct from sub-department entries", () => {
  const entries = [
    { department_path: ["Engineering"], user: "ada" },
    { department_path: ["Engineering", "Platform"], user: "grace" },
    { department_path: ["Engineering", "Platform", "Web"], user: "nina" },
    { department_path: ["Engineering", "Backend"], user: "leo" },
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering"]), {
    direct_count: 1,
    total_count: 4,
    distinct_users: ["ada", "grace", "leo", "nina"],
  });
});

test("excludes entries outside the rootPath scope", () => {
  const entries = [
    { department_path: ["Engineering", "Platform"], user: "ada" },
    { department_path: ["Design", "Brand"], user: "grace" },
    { department_path: ["Engineering"], user: "nina" },
    { department_path: ["EngineeringX", "Platform"], user: "leo" },
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering", "Platform"]), {
    direct_count: 1,
    total_count: 1,
    distinct_users: ["ada"],
  });
});

test("counts a user once across duplicate appearances", () => {
  const entries = [
    { department_path: ["Engineering", "Platform"], user: "ada" },
    { department_path: ["Engineering", "Platform", "Web"], user: "ada" },
    { department_path: ["Engineering", "Platform", "Mobile"], user: "ada" },
    { department_path: ["Engineering", "Platform", "Web"], user: "grace" },
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering", "Platform"]), {
    direct_count: 1,
    total_count: 4,
    distinct_users: ["ada", "grace"],
  });
});

test("returns zero counts and empty users for empty input", () => {
  assert.deepEqual(departmentScopeSummary([], ["Engineering"]), {
    direct_count: 0,
    total_count: 0,
    distinct_users: [],
  });
});

test("ignores invalid entries", () => {
  const entries = [
    null,
    { department_path: ["Engineering", "Platform"], user: "ada" },
    undefined,
    { user: "grace" },
    { department_path: "Engineering/Platform", user: "nina" },
    { department_path: ["Engineering", "Platform", "Web"], user: "leo" },
    { department_path: ["Engineering", null], user: "kai" },
    null,
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering", "Platform"]), {
    direct_count: 1,
    total_count: 2,
    distinct_users: ["ada", "leo"],
  });
});

test("counts entries without a user toward totals only", () => {
  const entries = [
    { department_path: ["Engineering", "Platform"] },
    { department_path: ["Engineering", "Platform", "Web"], user: "grace" },
    { department_path: ["Engineering", "Platform", "Mobile"], user: "" },
  ];

  assert.deepEqual(departmentScopeSummary(entries, ["Engineering", "Platform"]), {
    direct_count: 1,
    total_count: 3,
    distinct_users: ["grace"],
  });
});
