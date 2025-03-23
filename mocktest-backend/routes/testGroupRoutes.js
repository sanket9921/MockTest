const express = require("express");
const router = express.Router();
const testGroupController = require("../controllers/testGroupController");

// Define Routes
router.post("/", testGroupController.createTestGroup); // Create Test Group
router.get("/", testGroupController.getAllTestGroups); // Get all Test Groups
router.get("/:id", testGroupController.getTestGroupById); // Get Test Group by ID
router.put("/:id", testGroupController.updateTestGroup); // Update Test Group
router.delete("/:id", testGroupController.deleteTestGroup); // Delete Test Group
router.patch("/:id/toggle-publish", testGroupController.togglePublishStatus);

module.exports = router;
