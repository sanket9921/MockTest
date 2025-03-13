// controllers/testController.js
const { models } = require("../models");
const Test = models.Test;

// Create a new Test
exports.createTest = async (req, res) => {
  try {
    const { name, duration, difficulty, negative, group_id } = req.body;
    const newTest = await Test.create({
      name,
      duration,
      difficulty,
      negative,
      group_id,
    });
    return res.status(201).json(newTest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.findAll();
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Test by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json(test);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a Test by ID
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, difficulty, negative } = req.body;

    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update the existing test with new values
    test.name = name || test.name;
    test.duration = duration ?? null;
    test.difficulty = difficulty || test.difficulty;
    test.negative = negative ?? test.negative;

    await test.save();

    return res.status(200).json(test);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a Test by ID
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    await test.destroy();
    return res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTestByGroupId = async (req, res) => {
  try {
    const { group_id } = req.params;
    const tests = await Test.findAll({
      where: { group_id },
    });
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
