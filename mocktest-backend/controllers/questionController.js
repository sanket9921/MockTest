const { models } = require("../models"); // Import models
const cloudinary = require("../config/cloudinary");

const {
  uploadImageToCloudinary,
  extractCloudinaryId,
} = require("../services/imageService");
const { addQuestionService } = require("../services/questionService");
const { executeTransaction } = require("../utils/dbTransaction");
// Create a new Question
exports.createQuestion = async (req, res) => {
  try {
    const { content, content_type, type, test_id } = req.body;
    const newQuestion = await models.Question.create({
      content,
      content_type,
      type,
      test_id,
    });
    return res.status(201).json(newQuestion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await models.Question.findAll();
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single Question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await models.Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a Question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { content, content_type, marks } = req.body;
    // const file = req.file;

    const question = await models.Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (content_type === "image" && req.files && req.files.questionImage) {
      const publicId = extractCloudinaryId(question.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/questions/${publicId}`);
      }
      const content_url = await uploadImageToCloudinary(
        req.files.questionImage[0].path,
        "mock-test/questions"
      );
      console.log(content_url);
      question.content = content_url;
    } else {
      question.content = content;
    }
    question.content_type = content_type;
    question.marks = marks;

    await question.save();
    return res.status(200).json(question);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

// Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await models.Question.findByPk(id, {
      include: [
        {
          model: models.Option,
          as: "options",
        },
      ],
    });

    if (!question)
      return res.status(404).json({ message: "Question not found" });
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

    await question.destroy();
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const {
      test_id,
      content,
      content_type,
      question_type,
      marks,
      options = [],
      correct_answers,
    } = req.body;
    let questionContent = content;

    // Upload Question Image if applicable
    if (content_type === "image" && req.files && req.files.questionImage) {
      questionContent = await uploadImageToCloudinary(
        req.files.questionImage[0].path,
        "mock-test/questions"
      );
    }

    const newQuestion = await models.Question.create({
      test_id,
      content: questionContent,
      content_type,
      marks,
      type: question_type,
    });

    let createdOptions = [];
    console.log("Received options:", options);
    console.log("Type of options:", typeof options);
    const parsedOptions =
      typeof options === "string" ? JSON.parse(options) : options;

    // Step 2: Add Options (For MCQ/MSQ)
    if (Array.isArray(parsedOptions) && question_type !== "fill_in_the_blank") {
      createdOptions = await Promise.all(
        parsedOptions.map(async (option) => {
          let optionContent = option.content;

          // Upload option image if applicable
          if (
            option.content_type === "image" &&
            req.files &&
            req.files.optionImages &&
            req.files.optionImages[index]
          ) {
            optionContent = await uploadImageToCloudinary(
              req.files.optionImages[index].path,
              "mock-test/options"
            );
          }

          const newOption = await models.Option.create({
            question_id: newQuestion.id,
            content: optionContent,
            content_type: option.content_type, // "text" or "image"
          });
          return newOption; // Store created options
        })
      );
    }

    if (question_type === "fill_in_the_blank") {
      // Store the correct text answer for fill-in-the-blank
      await models.AnswersFib.create({
        question_id: newQuestion.id,
        correctTextAnswer: correct_answers, // Store correct text answer
      });
    } else {
      // Map correct_answers (indexes) to correct option IDs
      const optionIdMap = createdOptions.map((opt) => opt.id); // Extract generated option IDs
      const answer =
        typeof correct_answers === "string"
          ? JSON.parse(correct_answers)
          : correct_answers;

      await Promise.all(
        answer.map(async (correctIndex) => {
          await models.AnswersMCQMSQ.create({
            question_id: newQuestion.id,
            option_id: optionIdMap[correctIndex], // Store each correct answer
          });
        })
      );
    }

    return res
      .status(201)
      .json({ message: "Question added successfully!", question: newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addQuestion2 = async (req, res) => {
  try {
    const question = await executeTransaction(async (transaction) => {
      return await addQuestionService(req.body, req.files, transaction);
    });

    return res
      .status(201)
      .json({ message: "Question added successfully!", question });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getQuestionByTestId = async (req, res) => {
  try {
    const { testId } = req.params;

    const questions = await models.Question.findAll({
      where: { test_id: testId },
      order: [["id", "ASC"]],
      include: [
        {
          model: models.Option,
          separate: true, // ✅ Forces Sequelize to fetch options separately and apply ordering
          as: "options", // ✅ Match the alias in the association
          order: [["id", "ASC"]],
          include: [
            {
              model: models.AnswersMCQMSQ,
              as: "correct_answer", // ✅ Match the alias in the association
              attributes: ["option_id"],
            },
          ],
        },
        {
          model: models.AnswersFib,
          as: "fib_answer", // ✅ Match the alias in the association
          attributes: ["correctTextAnswer"],
        },
      ],
    });

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
