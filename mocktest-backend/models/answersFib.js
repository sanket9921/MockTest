const question = require("./question");
const option = require("./option");

module.exports = (sequelize, DataTypes) => {
  const AnswersFib = sequelize.define(
    "answers_fib",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      correctTextAnswer: {
        type: DataTypes.TEXT, // The correct answer text
        allowNull: false,
      },
    },
    {
      tableName: "mock_test_answers_fib",
    }
  );

  AnswersFib.associate = (models) => {
    AnswersFib.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
  };

  return AnswersFib;
};
