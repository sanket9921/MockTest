const { updateTotalMarks } = require("../services/testService");

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content_type: {
        type: DataTypes.ENUM("text", "image"),
        allowNull: false,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "single_choice",
          "multiple_choice",
          "fill_in_the_blank"
        ),
        allowNull: false,
      },
      passage_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null means it's a standalone question
        references: {
          model: "mock_test_passages",
          key: "id",
        },
      },
    },
    {
      tableName: "mock_test_question",
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.Test, {
      foreignKey: "test_id",
      onDelete: "CASCADE",
    });
    Question.belongsTo(models.Passage, {
      foreignKey: "passage_id",
      onDelete: "CASCADE",
      as: "passageData",
    });

    Question.hasMany(models.Option, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      as: "options",
    });
    Question.hasMany(models.AnswersMCQMSQ, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      as: "mcq_answers",
    });
    Question.hasOne(models.AnswersFib, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      as: "fib_answer",
    });
  };
  // ✅ Use `question.sequelize.models` to access models dynamically
  Question.afterCreate(async (question, options) => {
    setTimeout(async () => {
      const models = question.sequelize.models;
      await updateTotalMarks(models, question.test_id);
    }, 100);
  });

  Question.afterUpdate(async (question, options) => {
    setTimeout(async () => {
      const models = question.sequelize.models;
      await updateTotalMarks(models, question.test_id);
    }, 100);
  });

  Question.afterDestroy(async (question, options) => {
    setTimeout(async () => {
      const models = question.sequelize.models;
      await updateTotalMarks(models, question.test_id);
    }, 100);
  });
  return Question;
};
