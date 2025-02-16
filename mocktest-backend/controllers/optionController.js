const { models } = require("../models"); // Import models

// Create a new Option
exports.createOption = async (req, res) => {
  try {
    const { content, content_type, question_id } = req.body;
    const newOption = await models.Option.create({
      content,
      content_type,
      question_id,
    });
    return res.status(201).json(newOption);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Options for a specific Question
exports.getOptionsByQuestionId = async (req, res) => {
  try {
    const { question_id } = req.params;
    const options = await models.Option.findAll({
      where: { question_id },
    });
    return res.status(200).json(options);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Option by ID
exports.getOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });
    return res.status(200).json(option);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update an Option
exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, content_type, question_id } = req.body;

    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });

    option.content = content;
    option.content_type = content_type;
    option.question_id = question_id;

    await option.save();
    return res.status(200).json(option);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete an Option
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });

    await option.destroy();
    return res.status(200).json({ message: "Option deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
