/**
 * Updates the total marks of a test based on its questions.
 * @param {object} models - Sequelize models object
 * @param {number} testId - The ID of the test
 */
const updateTotalMarks = async (models, testId) => {
  try {
    if (!models || !models.Question || !models.Test) {
      console.error("Models not properly loaded!");
      return;
    }

    const totalMarks = await models.Question.sum("marks", {
      where: { test_id: testId },
    });

    console.log(totalMarks);

    await models.Test.update(
      { totalMarks: totalMarks || 0 }, // If no questions, set totalMarks to 0
      { where: { id: testId } }
    );
  } catch (error) {
    console.error("Error updating total marks:", error);
  }
};

module.exports = { updateTotalMarks };
