module.exports = (sequelize, DataTypes) => {
  const Passage = sequelize.define(
    "Passage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // Passage content (big paragraph)
      },
      content_type: {
        type: DataTypes.ENUM("text", "image"),
        allowNull: false,
        defaultValue: "text", // Passage can be text or image-based
      },
    },
    {
      tableName: "mock_test_passages",
    }
  );

  Passage.associate = (models) => {
    Passage.belongsTo(models.Test, {
      foreignKey: "test_id",
      onDelete: "CASCADE",
    });

    Passage.hasMany(models.Question, {
      foreignKey: "passage_id",
      onDelete: "CASCADE",
      as: "questions",
    });
  };

  return Passage;
};
