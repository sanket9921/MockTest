module.exports = (sequelize, DataTypes) => {
  const TestAttempt = sequelize.define(
    "TestAttempt",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      test_id: { type: DataTypes.INTEGER, allowNull: false },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      end_time: { type: DataTypes.DATE, allowNull: true },
      status: {
        type: DataTypes.ENUM("in_progress", "completed", "expired"),
        allowNull: false,
        defaultValue: "in_progress",
      },
      total_marks: {
        // Total possible marks in the test
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      marks_gained: {
        // Marks obtained by the user
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      negative_marks: {
        // Negative marks deducted for incorrect answers
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      final_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      attempted_questions: {
        // Number of questions the user attempted
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { tableName: "mock_test_attempts" }
  );

  TestAttempt.associate = (models) => {
    TestAttempt.belongsTo(models.Test, {
      foreignKey: "test_id",
      onDelete: "CASCADE",
    });
    TestAttempt.hasMany(models.UserAnswer, {
      foreignKey: "attempt_id",
      onDelete: "CASCADE",
    });
  };

  return TestAttempt;
};
