module.exports = (sequelize, DataTypes) => {
  const CorrectAnswer = sequelize.define(
    "CorrectAnswer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      option_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL for fill-in-the-blank
      },
      correct_text_answer: {
        type: DataTypes.TEXT,
        allowNull: true, // NULL for MCQ
      },
    },
    {
      tableName: "mock_test_correct_answers",
    }
  );

  CorrectAnswer.associate = (models) => {
    CorrectAnswer.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
    CorrectAnswer.belongsTo(models.Option, {
      foreignKey: "option_id",
      onDelete: "CASCADE",
      allowNull: true,
    });
  };

  return CorrectAnswer;
};
