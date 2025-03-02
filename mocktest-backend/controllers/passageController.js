const { models } = require("../models"); // Import models
const {
  uploadImageToCloudinary,
  extractCloudinaryId,
} = require("../services/imageService");

exports.updatePassage = async (req, res) => {
  try {
    const { id } = req.params;

    const { content, content_type } = req.body;
    // const file = req.file;

    console.log(id);
    const passage = await models.Passage.findByPk(id);
    if (!passage) return res.status(404).json({ message: "Passage not found" });

    if (content_type === "image" && req.files && req.files.file) {
      const publicId = extractCloudinaryId(passage.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/passage/${publicId}`);
      }
      const content_url = await uploadImageToCloudinary(
        req.files.file[0].path,
        "mock-test/passage"
      );
      passage.content = content_url;
    } else {
      passage.content = content;
    }
    passage.content_type = content_type;

    await passage.save();
    return res.status(200).json(passage);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

exports.deletePassage = async (req, res) => {
  try {
    const { id } = req.params;
    const passage = await models.Passage.findByPk(id, {
      include: [
        {
          model: models.Question,
          as: "questions",
          include: [{ model: models.Option, as: "options" }],
        },
      ],
    });

    if (!passage) return res.status(404).json({ message: "Passage not found" });

    // Delete Passage Image from Cloudinary (if exists)
    if (passage.content_type === "image" && passage.content) {
      const publicId = extractCloudinaryId(passage.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/passages/${publicId}`);
      }
    }

    // Loop through each question in the passage
    for (const question of passage.questions) {
      // Delete Question Image from Cloudinary (if exists)
      if (question.content_type === "image" && question.content) {
        const publicId = extractCloudinaryId(question.content);
        if (publicId) {
          await cloudinary.uploader.destroy(`mock-test/questions/${publicId}`);
        }
      }

      // Delete Related Options' Images from Cloudinary
      for (const option of question.options) {
        if (option.content_type === "image" && option.content) {
          const publicId = extractCloudinaryId(option.content);
          if (publicId) {
            await cloudinary.uploader.destroy(`mock-test/options/${publicId}`);
          }
        }
      }
    }

    // Delete Passage (Cascade will remove related questions and options)
    await passage.destroy();

    return res.status(200).json({ message: "Passage deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
