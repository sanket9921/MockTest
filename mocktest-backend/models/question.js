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
    Question.hasMany(models.Option, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
    Question.hasMany(models.AnswersMCQMSQ, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
    Question.hasOne(models.AnswersFib, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
  };

  return Question;
};
