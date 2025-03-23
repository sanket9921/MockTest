const { models, sequelize } = require("../models"); // Import the TestGroup model
const TestGroup = models.TestGroup; // Extract TestGroup model

const dotenv = require("dotenv");

dotenv.config();
const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : [];

// Create a new Test Group
exports.createTestGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTestGroup = await TestGroup.create({ name, description });
    return res.status(201).json(newTestGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllTestGroups = async (req, res) => {
  try {
    const userId = req.user?.user?.userId?.toString();
    const isAdmin = ADMIN_IDS.includes(userId);

    // Pagination parameters
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 9;
    const offset = (page - 1) * limit;

    // Count total test groups with at least one published test (if not admin)
    const totalCount = await models.TestGroup.count({
      where: isAdmin ? {} : { publish: true },
    });

    // Fetch paginated test groups
    const testGroups = await models.TestGroup.findAll({
      where: isAdmin ? {} : { publish: true },
      include: [
        {
          model: models.Test,
          attributes: [],
          required: false,
          where: isAdmin ? {} : { publish: true },
        },
      ],
      attributes: [
        "id",
        "name",
        "description",
        "publish",
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "mock_test_tests" AS "Tests"
            WHERE "Tests"."group_id" = "TestGroup"."id"
            ${isAdmin ? "" : 'AND "Tests"."publish" = true'}
          )`),
          "testCount",
        ],
      ],
      limit,
      offset,
      subQuery: false, // Ensures proper pagination
    });

    return res.status(200).json({
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: testGroups,
    });
  } catch (error) {
    console.error("Error fetching test groups:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish } = req.body;

    const testGroup = await models.TestGroup.findByPk(id);
    if (!testGroup) {
      return res.status(404).json({ message: "Test Group not found" });
    }

    testGroup.publish = publish;
    await testGroup.save();

    return res.status(200).json({
      message: `Test Group ${
        publish ? "Published" : "Unpublished"
      } successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Test Group by ID
exports.getTestGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const testGroup = await TestGroup.findByPk(id);
    if (!testGroup)
      return res.status(404).json({ message: "Test Group not found" });
    return res.status(200).json(testGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a Test Group
exports.updateTestGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const testGroup = await TestGroup.findByPk(id);
    if (!testGroup)
      return res.status(404).json({ message: "Test Group not found" });

    testGroup.name = name;
    testGroup.description = description;

    await testGroup.save();
    return res.status(200).json(testGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a Test Group
exports.deleteTestGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const testGroup = await TestGroup.findByPk(id);
    if (!testGroup)
      return res.status(404).json({ message: "Test Group not found" });

    await testGroup.destroy();
    return res.status(200).json({ message: "Test Group deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
