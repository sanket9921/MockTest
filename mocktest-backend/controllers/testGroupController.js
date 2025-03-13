const { models, sequelize } = require("../models"); // Import the TestGroup model
const TestGroup = models.TestGroup; // Extract TestGroup model

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

// Get all Test Groups with Test Count
exports.getAllTestGroups = async (req, res) => {
  try {
    const testGroups = await TestGroup.findAll({
      include: [
        {
          model: models.Test,
          attributes: [], // We don't need individual test details, just the count
        },
      ],
      attributes: [
        "id",
        "name",
        "description",
        [sequelize.fn("COUNT", sequelize.col("Tests.id")), "testCount"], // Count tests in each group
      ],
      group: ["TestGroup.id"], // Group by test group
    });

    return res.status(200).json(testGroups);
  } catch (error) {
    console.error("Error fetching test groups:", error);
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
