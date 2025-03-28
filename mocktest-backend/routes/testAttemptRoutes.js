const express = require("express");
const router = express.Router();
const testAttemptController = require("../controllers/testAttemptController");

router.post("/tests/:testId/start", testAttemptController.startTestAttempt);

// router.get(
//   "/attempts/:attemptId/questions",
//   testAttemptController.getPaginatedQuestion
// );

router.get(
  "/attempts/:attemptId/questions",
  testAttemptController.getTestAttemptQuestions
);

router.get(
  "/attempts/:attemptId/useranswers",
  testAttemptController.getUserAnswersForAttempt
);

router.post(
  "/attempts/:attemptId/mark-review",
  testAttemptController.markForReview
);

router.post(
  "/attempts/:attemptId/clearAnswer",
  testAttemptController.clearAnswer
);

router.get(
  "/attempts/getTestAttemptStats/:attemptId",
  testAttemptController.getTestAttemptStats
);
router.get(
  "/attempts/getRemainingTime/:attemptId",
  testAttemptController.getRemainingTime
);

router.post("/attempts/:attemptId/answer", testAttemptController.saveAnswer);
router.post("/attempts/:attemptId/submit", testAttemptController.submitTest);
router.get("/attempts/:attemptId/result", testAttemptController.getTestResult);
router.get("/attempts/in-progress", testAttemptController.getInProgressTests);
router.get("/attempts/testcompleted", testAttemptController.getCompletedTests);
router.get(
  "/attempts/top-categories",
  testAttemptController.getTopCategoriesByTestAttempts
);

router.get(
  "/attempts/category-wise-scores",
  testAttemptController.getCategoryWiseScores
);
router.get(
  "/attempts/category-average-scores",
  testAttemptController.getCategoryAverageScores
);

module.exports = router;
