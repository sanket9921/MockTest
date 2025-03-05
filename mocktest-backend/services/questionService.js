const { models } = require("../models");
const { uploadImageToCloudinary } = require("./imageService");
const { updateTotalMarks } = require("./testService");

// Function to add a new question
exports.addQuestionService = async (data, files, transaction) => {
  let {
    test_id,
    passage_id,
    content,
    content_type,
    question_type,
    explanation,
    marks,
    options,
    correct_answers,
  } = data;

  console.log(files);
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
      passage_id: passage_id || null,
      content: questionContent,
      content_type,
      marks,
      type: question_type,
      explanation,
    },
    { transaction }
  );

  let createdOptions = [];
  let imageIndex = 0; // To track images in the `optionImages` array

  // Store Options if not FILL_IN_THE_BLANK
  if (question_type !== "fill_in_the_blank") {
    const optionInstances = [];

    for (let index = 0; index < options.length; index++) {
      let option = options[index];
      let optionContent = option.content;

      // If the option content is empty and it's supposed to be an image
      if (!optionContent && option.content_type === "image") {
        optionContent = "Image to be uploaded"; // Placeholder if no image URL yet
      }

      // Check if the option is an image and if we have an image to upload
      if (
        option.content_type === "image" &&
        files[`optionImages[${index}]`]?.[0]
      ) {
        console.log(
          `Uploading image for option ${index}: ${
            files[`optionImages[${index}]`]?.[0].path
          }`
        );

        try {
          // Upload the image to Cloudinary and get the URL
          const imageUrl = await uploadImageToCloudinary(
            files[`optionImages[${index}]`]?.[0].path,
            "mock-test/options"
          );

          // Replace the content with the Cloudinary URL
          optionContent = imageUrl;
          console.log(
            `Option ${index} image uploaded successfully: ${imageUrl}`
          );

          // Increment image index only if the option is an image
          imageIndex++;
        } catch (error) {
          console.error(`Error uploading image for option ${index}:`, error);
          optionContent = "Image upload failed"; // Fallback if image upload fails
        }
      }

      // Add the option creation promise to the array
      optionInstances.push(
        models.Option.create(
          {
            question_id: newQuestion.id,
            content: optionContent,
            content_type: option.content_type,
          },
          { transaction }
        )
      );
    }

    // Wait for all options to be created and maintain order
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
