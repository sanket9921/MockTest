module.exports = (sequelize, DataTypes) => {
  const ReviewStatus = sequelize.define(
    "ReviewStatus",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      attempt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mock_test_attempts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mock_test_question",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      marked_for_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "mock_test_review_status",
      timestamps: true, // Enables createdAt and updatedAt
      underscored: true, // Uses snake_case column names
      indexes: [
        {
          unique: true,
          fields: ["attempt_id", "question_id"],
        },
      ],
    }
  );

  ReviewStatus.associate = (models) => {
    ReviewStatus.belongsTo(models.TestAttempt, {
      foreignKey: "attempt_id",
      onDelete: "CASCADE",
    });
    ReviewStatus.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
  };

  return ReviewStatus;
};
