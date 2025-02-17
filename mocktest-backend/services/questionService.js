const { models } = require("../models");
const { uploadImageToCloudinary } = require("./imageService");

// Function to add a new question
exports.addQuestionService = async (data, files, transaction) => {
  let {
    test_id,
    content,
    content_type,
    question_type,
    marks,
    options,
    correct_answers,
  } = data;

  // Parse options if they are a string (from form-data)
  if (typeof options === "string") {
    options = JSON.parse(options);
  }

  let questionContent = content;

  // Upload Question Image if applicable
  if (content_type === "image" && files && files.questionImage) {
    questionContent = await uploadImageToCloudinary(
      files.questionImage[0].path,
      "mock-test/questions"
    );
  }

  // Store Question
  const newQuestion = await models.Question.create(
    {
      test_id,
      content: questionContent,
      content_type,
      marks,
      type: question_type,
    },
    { transaction }
  );

  let createdOptions = [];

  // Store Options if not FILL_IN_THE_BLANK
  if (question_type !== "fill_in_the_blank") {
    const optionInstances = await Promise.all(
      options.map(async (option, index) => {
        let optionContent = option.content;

        // Upload option image if applicable
        if (option.content_type === "image" && files?.optionImages?.[index]) {
          optionContent = await uploadImageToCloudinary(
            files.optionImages[index].path,
            "mock-test/options"
          );
        }

        return models.Option.create(
          {
            question_id: newQuestion.id,
            content: optionContent,
            content_type: option.content_type,
          },
          { transaction }
        );
      })
    );

    createdOptions = await Promise.all(optionInstances);
  }

  // Store Correct Answers
  if (question_type === "fill_in_the_blank") {
    await models.AnswersFib.create(
      { question_id: newQuestion.id, correctTextAnswer: correct_answers },
      { transaction }
    );
  } else {
    if (!Array.isArray(correct_answers)) {
      try {
        correct_answers = JSON.parse(correct_answers);
        if (!Array.isArray(correct_answers)) {
          correct_answers = [correct_answers]; // Convert single values to array
        }
      } catch (error) {
        console.error("Error parsing correct_answers:", error);
        correct_answers = []; // Fallback to empty array
      }
    }
    // Ensure correct answers are mapped to option IDs
    const correctAnswerData = correct_answers
      .map((correctIndex) => {
        if (createdOptions[correctIndex]) {
          return {
            question_id: newQuestion.id,
            option_id: createdOptions[correctIndex].id,
          };
        }
        console.error(`Invalid correct answer index: ${correctIndex}`);
        return null; // Skip invalid indices
      })
      .filter((answer) => answer !== null); // Remove invalid entries

    if (correctAnswerData.length > 0) {
      await models.AnswersMCQMSQ.bulkCreate(correctAnswerData, { transaction });
    } else {
      console.error("No valid correct answers to store.");
    }
  }

  return newQuestion;
};
