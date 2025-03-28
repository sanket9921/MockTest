module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define(
    "Option",
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
    },
    {
      tableName: "mock_test_options",
    }
  );

  Option.associate = (models) => {
    Option.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      as: "question",
    });
    Option.hasOne(models.AnswersMCQMSQ, {
      foreignKey: "option_id",
      onDelete: "CASCADE",
      as: "correct_answer",
    });
  };

  return Option;
};
