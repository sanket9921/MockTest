const { models } = require("../models"); // Import models

// Create a new Question
exports.createQuestion = async (req, res) => {
  try {
    const { content, content_type, type, test_id } = req.body;
    const newQuestion = await models.Question.create({
      content,
      content_type,
      type,
      test_id,
    });
    return res.status(201).json(newQuestion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await models.Question.findAll();
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await models.Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a Question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, content_type, type, test_id } = req.body;

    const question = await models.Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    question.content = content;
    question.content_type = content_type;
    question.type = type;
    question.test_id = test_id;

    await question.save();
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await models.Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    await question.destroy();
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
