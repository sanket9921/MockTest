module.exports = (sequelize, DataTypes) => {
  const TestAttempt = sequelize.define(
    "TestAttempt",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false }, // Comes from main project
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
      total_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }, // Stores final score
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
