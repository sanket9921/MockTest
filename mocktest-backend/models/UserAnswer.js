module.exports = (sequelize, DataTypes) => {
  const UserAnswer = sequelize.define(
    "UserAnswer",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      attempt_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      option_id: { type: DataTypes.INTEGER, allowNull: true }, // For MCQ/MSQ
      fib_answer: { type: DataTypes.STRING, allowNull: true }, // For Fill in the Blank
      marked_for_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { tableName: "mock_test_user_answers" }
  );

  UserAnswer.associate = (models) => {
    UserAnswer.belongsTo(models.TestAttempt, {
      foreignKey: "attempt_id",
      onDelete: "CASCADE",
    });
    UserAnswer.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
    UserAnswer.belongsTo(models.Option, {
      foreignKey: "option_id",
      onDelete: "CASCADE",
      allowNull: true,
    });
  };

  return UserAnswer;
};
