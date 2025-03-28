module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "mock_test_categories",
    }
  );

  Category.associate = (models) => {
    // ✅ A Category can have multiple Tests
    Category.hasMany(models.Test, {
      foreignKey: "category_id",
      onDelete: "SET NULL",
    });
  };

  return Category;
};
