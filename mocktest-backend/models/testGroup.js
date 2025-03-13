module.exports = (sequelize, DataTypes) => {
  const TestGroup = sequelize.define(
    "TestGroup",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "mock_test_tests_groups",
      timestamps: true,
    }
  );

  TestGroup.associate = (models) => {
    TestGroup.hasMany(models.Test, {
      foreignKey: "group_id",
      onDelete: "CASCADE",
    });
  };

  return TestGroup;
};
