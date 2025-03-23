const { models } = require("../models"); // Import models
const cloudinary = require("../config/cloudinary");
const { sequelize } = require("../models");

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

    if (content_type === "image" && req.files && req.files.file) {
      const publicId = extractCloudinaryId(question.content);
      if (publicId) {
        await cloudinary.uploader.destroy(`mock-test/questions/${publicId}`);
      }
      const content_url = await uploadImageToCloudinary(
        req.files.file[0].path,
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

// exports.addQuestion = async (req, res) => {
//   try {
//     const {
//       test_id,
//       content,
//       content_type,
//       question_type,
//       marks,
//       options = [],
//       correct_answers,
//     } = req.body;
//     let questionContent = content;

//     // Upload Question Image if applicable
//     if (content_type === "image" && req.files && req.files.questionImage) {
//       questionContent = await uploadImageToCloudinary(
//         req.files.questionImage[0].path,
//         "mock-test/questions"
//       );
//     }

//     const newQuestion = await models.Question.create({
//       test_id,
//       content: questionContent,
//       content_type,
//       marks,
//       type: question_type,
//     });

//     let createdOptions = [];
//     console.log("Received options:", options);
//     console.log("Type of options:", typeof options);
//     const parsedOptions =
//       typeof options === "string" ? JSON.parse(options) : options;

//     // Step 2: Add Options (For MCQ/MSQ)
//     if (Array.isArray(parsedOptions) && question_type !== "fill_in_the_blank") {
//       createdOptions = await Promise.all(
//         parsedOptions.map(async (option) => {
//           let optionContent = option.content;

//           // Upload option image if applicable
//           if (
//             option.content_type === "image" &&
//             req.files &&
//             req.files.optionImages &&
//             req.files.optionImages[index]
//           ) {
//             optionContent = await uploadImageToCloudinary(
//               req.files.optionImages[index].path,
//               "mock-test/options"
//             );
//           }

//           const newOption = await models.Option.create({
//             question_id: newQuestion.id,
//             content: optionContent,
//             content_type: option.content_type, // "text" or "image"
//           });
//           return newOption; // Store created options
//         })
//       );
//     }

//     if (question_type === "fill_in_the_blank") {
//       // Store the correct text answer for fill-in-the-blank
//       await models.AnswersFib.create({
//         question_id: newQuestion.id,
//         correctTextAnswer: correct_answers, // Store correct text answer
//       });
//     } else {
//       // Map correct_answers (indexes) to correct option IDs
//       const optionIdMap = createdOptions.map((opt) => opt.id); // Extract generated option IDs
//       const answer =
//         typeof correct_answers === "string"
//           ? JSON.parse(correct_answers)
//           : correct_answers;

//       await Promise.all(
//         answer.map(async (correctIndex) => {
//           await models.AnswersMCQMSQ.create({
//             question_id: newQuestion.id,
//             option_id: optionIdMap[correctIndex], // Store each correct answer
//           });
//         })
//       );
//     }

//     return res
//       .status(201)
//       .json({ message: "Question added successfully!", question: newQuestion });
//   } catch (error) {
//     console.error("Error adding question:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.addQuestion2 = async (req, res) => {
  try {
    const files = {};

    req.files.forEach((file) => {
      if (!files[file.fieldname]) {
        files[file.fieldname] = [];
      }
      files[file.fieldname].push(file);
    });
    const question = await executeTransaction(async (transaction) => {
      return await addQuestionService(req.body, files, transaction);
    });

    return res
      .status(201)
      .json({ message: "Question added successfully!", question });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getQuestionsByTestId = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await models.Test.findByPk(testId);
    // Fetch all questions in insertion order
    const questions = await models.Question.findAll({
      where: { test_id: testId },
      order: [["id", "ASC"]],
      include: [
        {
          model: models.Passage,
          as: "passageData",
          attributes: ["id", "content", "content_type"],
        },
        {
          model: models.Option,
          as: "options",
          separate: true,
          order: [["id", "ASC"]],
          include: [
            {
              model: models.AnswersMCQMSQ,
              as: "correct_answer",
            },
          ],
        },
        {
          model: models.AnswersFib,
          as: "fib_answer",
        },
      ],
    });

    const structuredQuestions = [];
    const passageMap = new Map();

    questions.forEach((question) => {
      const questionData = question.toJSON();

      if (questionData.passage_id) {
        // Passage-based question: group under its passage
        if (!passageMap.has(questionData.passage_id)) {
          passageMap.set(questionData.passage_id, {
            passage_id: questionData.passageData.id,
            content: questionData.passageData.content,
            content_type: questionData.passageData.content_type,
            questions: [],
          });
          structuredQuestions.push(passageMap.get(questionData.passage_id));
        }
        passageMap.get(questionData.passage_id).questions.push(questionData);
      } else {
        // Standalone question: push directly
        structuredQuestions.push(questionData);
      }
    });

    res
      .status(200)
      .json({ success: true, data: structuredQuestions, test: test });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addPassageWithQuestions = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { test_id, passage_content, passage_content_type, questions } =
      req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }

    let passageContent = passage_content;

    //  Upload Passage Image if applicable
    if (passage_content_type === "image" && req.files?.passageImage) {
      passageContent = await uploadImageToCloudinary(
        req.files.passageImage[0].path,
        "mock-test/passages"
      );
    }

    // Store Passage
    const newPassage = await models.Passage.create(
      {
        test_id,
        content: passageContent,
        content_type: passage_content_type,
      },
      { transaction }
    );

    let createdQuestions = [];

    // Loop through questions and use `addQuestionService`
    for (const questionData of questions) {
      //  Ensure passage_id is set correctly
      const questionPayload = {
        ...questionData,
        test_id, // Ensure test_id is passed
        passage_id: newPassage.id, //  Link question to passage
      };

      const newQuestion = await addQuestionService(
        questionPayload,
        req.files,
        transaction
      );
      createdQuestions.push(newQuestion);
    }

    await transaction.commit();
    return res.status(201).json({
      message: "Passage and questions added successfully",
      passage: newPassage,
      questions: createdQuestions,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding passage with questions:", error);
    return res
      .status(500)
      .json({ message: "Failed to add passage with questions", error });
  }
};

exports.updateExplanation = async (req, res) => {
  try {
    const { questionId } = req.params; // Extract from params instead of body
    const { explanation } = req.body;

    if (!questionId || isNaN(Number(questionId))) {
      return res.status(400).json({ message: "Invalid questionId" });
    }

    if (typeof explanation !== "string" || explanation.trim() === "") {
      return res.status(400).json({ message: "Explanation is required" });
    }

    const [updatedRows] = await models.Question.update(
      { explanation },
      { where: { id: Number(questionId) } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res
      .status(200)
      .json({ message: "Explanation updated successfully" });
  } catch (error) {
    console.error("Error updating explanation:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
