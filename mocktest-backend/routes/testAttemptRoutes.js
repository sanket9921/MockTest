const express = require("express");
const router = express.Router();
const testAttemptController = require("../controllers/testAttemptController");

router.post("/tests/:testId/start", testAttemptController.startTestAttempt);
router.get(
  "/attempts/:attemptId/questions",
  testAttemptController.getPaginatedQuestion
);
router.post(
  "/attempts/:attemptId/mark-review",
  testAttemptController.markForReview
);
router.get(
  "/attempts/getTestAttemptStats/:attemptId",
  testAttemptController.getTestAttemptStats
);

router.post("/attempts/:attemptId/answer", testAttemptController.saveAnswer);
router.post("/attempts/:attemptId/submit", testAttemptController.submitTest);
router.get("/attempts/:attemptId/result", testAttemptController.getTestResult);

module.exports = router;
