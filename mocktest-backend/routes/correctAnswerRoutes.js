const express = require("express");
const router = express.Router();
const correctAnswerController = require("../controllers/correctAnswerController");

// Route to create a new correct answer
router.post("/", correctAnswerController.createCorrectAnswer);

// Route to get all correct answers for a specific question
router.get(
  "/question/:question_id",
  correctAnswerController.getCorrectAnswersByQuestionId
);

// Route to get a single correct answer by ID
router.get("/:id", correctAnswerController.getCorrectAnswerById);

// Route to update a correct answer
router.put("/:questionId", correctAnswerController.updateCorrectAnswer);

// Route to delete a correct answer
router.delete("/:id", correctAnswerController.deleteCorrectAnswer);
router.get(
  "/getfibanswer/:question_id",
  correctAnswerController.getAnswerOfFib
);

module.exports = router;
