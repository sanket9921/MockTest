const express = require("express");
const router = express.Router();
const passageController = require("../controllers/passageController");
const upload = require("../middlewares/upload");

router.put(
  "/:id",
  upload.fields([{ name: "file", maxCount: 1 }]),
  passageController.updatePassage
);
router.delete("/:id", passageController.deletePassage);

module.exports = router;
