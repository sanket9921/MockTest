module.exports = (sequelize, DataTypes) => {
  const AnswersMCQMSQ = sequelize.define(
    "answers_mcq_msq",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "mock_test_answers_mcq_msq",
    }
  );

  AnswersMCQMSQ.associate = (models) => {
    AnswersMCQMSQ.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
    });
    AnswersMCQMSQ.belongsTo(models.Option, {
      foreignKey: "option_id",
      onDelete: "CASCADE",
      allowNull: true,
    });
  };

  return AnswersMCQMSQ;
};
