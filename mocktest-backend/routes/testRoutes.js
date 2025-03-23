// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.post("/", testController.createTest); // Create a new Test
router.get("/", testController.getAllTests); // Get all Tests
router.get("/:id", testController.getTestById); // Get a Test by ID
router.put("/:id", testController.updateTest); // Update a Test by ID
router.delete("/:id", testController.deleteTest); // Delete a Test by ID
router.get("/group/:group_id", testController.getTestByGroupId);
router.patch("/:testId/publish", testController.togglePublishStatus);

module.exports = router;
