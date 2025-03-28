const { models } = require("../models");

// ✅ Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await models.Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// ✅ Create a new category
const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await models.Category.create({ category_name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from URL
    const { category_name } = req.body; // Get updated category data

    // Check if category exists
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category
    await category.update({ category_name });

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
