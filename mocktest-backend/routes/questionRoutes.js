const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const upload = require("../middlewares/upload");

router.post("/", questionController.createQuestion);
router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);
router.post(
  "/addquestion",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionImages", maxCount: 10 },
  ]),
  questionController.addQuestion
);
router.post(
  "/addquestion2",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionImages", maxCount: 10 },
  ]),
  questionController.addQuestion2
);

module.exports = router;
