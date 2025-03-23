const { models } = require("../models");

// Create a new CorrectAnswer
exports.createCorrectAnswer = async (req, res) => {
  try {
    const { option_id, correct_text_answer, question_id } = req.body;

    const newCorrectAnswer = await models.CorrectAnswer.create({
      option_id,
      correct_text_answer,
      question_id,
    });
    return res.status(201).json(newCorrectAnswer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Correct Answers for a specific Question
exports.getCorrectAnswersByQuestionId = async (req, res) => {
  try {
    const { question_id } = req.params;
    const correctAnswers = await models.AnswersMCQMSQ.findAll({
      where: { question_id },
    });
    return res.status(200).json(correctAnswers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single CorrectAnswer by ID
exports.getCorrectAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    const correctAnswer = await models.CorrectAnswer.findByPk(id);
    if (!correctAnswer)
      return res.status(404).json({ message: "Answer not found" });
    return res.status(200).json(correctAnswer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a CorrectAnswer
exports.updateCorrectAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { correct_answers } = req.body; // Array of option IDs

  try {
    // Remove all previous correct answers for this question
    await models.AnswersMCQMSQ.destroy({
      where: { question_id: questionId },
    });

    console.log(correct_answers);
    // Insert new correct answers
    if (correct_answers.length > 0) {
      const newCorrectAnswers = correct_answers.map((optionId) => ({
        question_id: questionId,
        option_id: optionId,
      }));

      await models.AnswersMCQMSQ.bulkCreate(newCorrectAnswers);
    }

    res.status(200).json({
      success: true,
      message: "Correct answers updated successfully",
    });
  } catch (error) {
    console.error("Error updating correct answers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a CorrectAnswer
exports.deleteCorrectAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const correctAnswer = await models.CorrectAnswer.findByPk(id);
    if (!correctAnswer)
      return res.status(404).json({ message: "Answer not found" });

    await correctAnswer.destroy();
    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAnswerOfFib = async (req, res) => {
  try {
    const { question_id } = req.params;
    const answer = await models.AnswersFib.findAll({
      where: { question_id },
    });
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    return res.status(200).json(answer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateAnswerOfFib = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { correctTextAnswer } = req.body;

    console.log("Received request:", { questionId, correctTextAnswer });

    // Validate questionId
    if (!questionId || isNaN(Number(questionId))) {
      return res.status(400).json({ message: "Invalid questionId" });
    }

    // Validate correctTextAnswer
    if (
      typeof correctTextAnswer !== "string" ||
      correctTextAnswer.trim() === ""
    ) {
      return res.status(400).json({ message: "Correct answer is required" });
    }

    // Check if the answer exists for the given question_id
    const existingAnswer = await models.AnswersFib.findOne({
      where: { question_id: Number(questionId) },
    });

    if (!existingAnswer) {
      return res
        .status(404)
        .json({ message: "Answer not found for the given question" });
    }

    // Update the FIB answer
    await existingAnswer.update({ correctTextAnswer });

    return res.status(200).json({ message: "Answer updated successfully" });
  } catch (error) {
    console.error("Error updating FIB answer:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
