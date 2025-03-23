const permissions = {
  // ✅ User & Admin Access
  "/api/test-groups": ["user", "admin"], // GET all test groups
  "/api/test-groups/:id": ["user", "admin"], // GET test group by ID

  "/api/tests": ["user", "admin"], // GET all tests
  "/api/tests/:id": ["user", "admin"], // GET test by ID
  "/api/tests/group/:group_id": ["user", "admin"], // GET tests by group ID

  "/api/tests/:id/start": ["user", "admin"], // Users & admins can start tests

  "/api/attempts*": ["user", "admin"], // All test attempts endpoints (start, submit, etc.)

  //  Admin-Only (handled by middleware)
};

module.exports = permissions;
