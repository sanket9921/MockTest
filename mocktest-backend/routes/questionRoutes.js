const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const upload = require("../middlewares/upload");

router.post("/", questionController.createQuestion);
router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.put(
  "/:id",
  upload.fields([{ name: "file", maxCount: 1 }]),
  questionController.updateQuestion
);
router.delete("/:id", questionController.deleteQuestion);
// router.post(
//   "/addquestion",
//   upload.fields([
//     { name: "questionImage", maxCount: 1 },
//     { name: "optionImages", maxCount: 10 },
//   ]),
//   questionController.addQuestion
// );
router.post("/addquestion2", upload.any(), questionController.addQuestion2);

router.post(
  "/addPassageWithQuestions",
  upload.fields([
    { name: "passageImage", maxCount: 1 },
    { name: "questionImages", maxCount: 10 },
    { name: "optionImages", maxCount: 20 },
  ]),
  questionController.addPassageWithQuestions
);

router.get("/testquestions/:testId", questionController.getQuestionsByTestId);
router.put(
  "/updateExplanation/:questionId",
  questionController.updateExplanation
);

module.exports = router;
