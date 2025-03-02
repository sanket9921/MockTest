const { models } = require("../models"); // Import models
const {
  extractCloudinaryId,
  uploadImageToCloudinary,
} = require("../services/imageService");
const cloudinary = require("../config/cloudinary");

exports.createOption = async (req, res) => {
  try {
    const { content, content_type, question_id } = req.body;

    if (!question_id) {
      return res.status(400).json({ error: "Question ID is required." });
    }

    let contentUrl = content;

    // If the option is an image, upload it to Cloudinary
    if (content_type === "image") {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required." });
      }

      contentUrl = await uploadImageToCloudinary(
        req.file.path,
        "mock-test/options"
      );
    }

    // Save the option to the database
    const newOption = await models.Option.create({
      content: contentUrl,
      content_type,
      question_id,
    });

    return res.status(201).json(newOption);
  } catch (error) {
    console.error("Error creating option:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get all Options for a specific Question
exports.getOptionsByQuestionId = async (req, res) => {
  try {
    const { question_id } = req.params;
    const options = await models.Option.findAll({
      where: { question_id },
    });
    return res.status(200).json(options);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Option by ID
exports.getOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });
    return res.status(200).json(option);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update an Option
exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, content_type } = req.body;

    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });

    let newContent = content;
    if (content_type == "image" && req.file) {
      const publicId = extractCloudinaryId(option.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/options/${publicId}`);
      }
      const content_url = await uploadImageToCloudinary(
        req.file.path,
        "mock-test/options"
      );
      console.log(content_url);
      option.content = content_url;
    } else {
      option.content = content;
    }
    option.content_type = content_type;

    await option.save();
    return res.status(200).json(option);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete an Option
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;

    const option = await models.Option.findByPk(id);
    if (!option) return res.status(404).json({ message: "Option not found" });
    if (option.content_type === "image" && option.content) {
      const publicId = extractCloudinaryId(option.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/options/${publicId}`);
      }
    }
    await option.destroy();
    return res.status(200).json({ message: "Option deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
