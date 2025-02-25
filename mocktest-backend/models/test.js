module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "mock_test_tests",
    }
  );

  Test.associate = (models) => {
    Test.belongsTo(models.TestGroup, {
      foreignKey: "group_id",
      onDelete: "CASCADE",
    });
    Test.hasMany(models.Question, {
      foreignKey: "test_id",
      onDelete: "CASCADE",
    });
  };

  return Test;
};
