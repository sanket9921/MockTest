const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
// ✅ GET all categories
router.get("/", categoryController.getCategories);

// ✅ POST create a new category
router.post("/", categoryController.createCategory);

router.put("/:id", categoryController.updateCategory);

// ✅ DELETE a category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
