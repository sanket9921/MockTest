const express = require("express");
const router = express.Router();
const optionController = require("../controllers/optionController");
const upload = require("../middlewares/upload");

// Route to create a new option
router.post("/", upload.single("file"), optionController.createOption);

// Route to get all options for a specific question
router.get("/question/:question_id", optionController.getOptionsByQuestionId);

// Route to get a single option by ID
router.get("/:id", optionController.getOptionById);

// Route to update an option
router.put("/:id", upload.single("file"), optionController.updateOption);

// Route to delete an option
router.delete("/:id", optionController.deleteOption);

module.exports = router;
