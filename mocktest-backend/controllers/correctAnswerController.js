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
  try {
    const { id } = req.params;
    const { option_id, correct_text_answer, question_id } = req.body;

    const correctAnswer = await models.CorrectAnswer.findByPk(id);
    if (!correctAnswer)
      return res.status(404).json({ message: "Answer not found" });

    correctAnswer.option_id = option_id;
    correctAnswer.correct_text_answer = correct_text_answer;
    correctAnswer.question_id = question_id;

    await correctAnswer.save();
    return res.status(200).json(correctAnswer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
