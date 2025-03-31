// controllers/testController.js
const { Op, fn, col, literal, Sequelize } = require("sequelize");
const { models } = require("../models");
const Test = models.Test;

// Create Test with Category
exports.createTest = async (req, res) => {
  try {
    const { name, duration, difficulty, negative, group_id, category_id } =
      req.body;

    // Check if the category exists
    const category = await models.Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create new test
    const newTest = await models.Test.create({
      name,
      duration,
      difficulty,
      negative,
      group_id,
      category_id,
    });

    return res.status(201).json(newTest);
  } catch (error) {
    console.log(error);
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

// Get a single Test by ID with question count
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await models.Test.findOne({
      where: { id },
      attributes: {
        include: [
          [fn("COUNT", col("Questions.id")), "question_count"], // Count questions
        ],
      },
      include: [
        {
          model: models.Question,
          attributes: [], // We only need the count, so no need to fetch question details
        },
      ],
      group: ["Test.id"], // Ensure correct aggregation
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json(test);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Test with Category
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, difficulty, negative, category_id } = req.body;

    // Find test by ID
    const test = await models.Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // If category is provided, check if it exists
    if (category_id) {
      const category = await models.Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Update the test
    test.name = name || test.name;
    test.duration = duration ?? null;
    test.difficulty = difficulty || test.difficulty;
    test.negative = negative ?? test.negative;
    test.category_id = category_id || test.category_id;

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
    const userId = req.user?.user?.userId?.toString();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;

    // Check if user is an admin
    const adminIds = process.env.ADMIN_IDS
      ? process.env.ADMIN_IDS.split(",")
      : [];
    const isAdmin = adminIds.includes(userId);

    // Fetch total count separately to fix count issue with grouping
    const totalCount = await models.Test.count({
      where: isAdmin ? { group_id } : { group_id, publish: true },
    });

    // Fetch paginated test data with a stable order
    const tests = await models.Test.findAll({
      where: isAdmin ? { group_id } : { group_id, publish: true },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM mock_test_question AS q
              WHERE q.test_id = "Test".id
            )`),
            "question_count",
          ],
        ],
      },
      order: [["createdAt", "ASC"]], // Ensures stable order to prevent shuffling
      limit,
      offset,
    });

    return res.status(200).json({
      data: tests,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit), // Corrected pagination calculation
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.togglePublishStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const { publish } = req.body;

    const test = await models.Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    test.publish = publish;
    await test.save();

    return res
      .status(200)
      .json({ message: `Test ${publish ? "Published" : "Unpublished"}` });
  } catch (error) {
    console.error("Error updating publish status:", error);
    return res.status(500).json({ error: error.message });
  }
};
