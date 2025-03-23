const { models } = require("../models");
const { Op, Sequelize, where } = require("sequelize");

exports.startTestAttempt = async (req, res) => {
  const { testId } = req.params;
  const userId = req.user.user.userId;
  console.log(req.user);

  if (!testId || !userId) {
    return res
      .status(400)
      .json({ message: "Test ID and User ID are required." });
  }

  try {
    // Check if user already has an in-progress attempt
    const existingAttempt = await models.TestAttempt.findOne({
      where: { user_id: userId, test_id: testId, status: "in_progress" },
    });

    if (existingAttempt) {
      return res.status(200).json({
        attemptId: existingAttempt.id,
        message: "Resuming existing test attempt.",
      });
    }
    const test = await models.Test.findByPk(testId);
    const startTime = new Date();
    let endTime = null;

    // Set end time only if the test has a duration
    if (test.duration && test.duration > 0) {
      endTime = new Date(startTime.getTime() + test.duration * 60 * 1000);
    }

    // Create a new test attempt
    const attempt = await models.TestAttempt.create({
      user_id: userId,
      test_id: testId,
      start_time: startTime,
      end_time: endTime,
    });

    res.status(201).json({
      attemptId: attempt.id,
      message: "Test started successfully",
      startTime,
      endTime,
      hasTimeLimit: !!endTime, // Send a flag to the frontend
    });
  } catch (error) {
    console.error("Error starting test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRemainingTime = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const attempt = await models.TestAttempt.findByPk(attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    if (!attempt.end_time) {
      // If no time limit, return null
      return res.json({ remainingTime: null });
    }

    const currentTime = new Date();
    const endTime = new Date(attempt.end_time);
    const remainingTime = Math.max(
      Math.floor((endTime - currentTime) / 1000),
      0
    );

    res.json({ remainingTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTestAttemptQuestions = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Fetch the test attempt
    const testAttempt = await models.TestAttempt.findOne({
      where: { id: attemptId },
    });

    if (!testAttempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    // If the test is completed, redirect to results page
    if (testAttempt.status === "completed") {
      return res.json({ redirect: `/attempts/${attemptId}/result` });
    }

    // Fetch all questions in insertion order
    const questions = await models.Question.findAll({
      where: { test_id: testAttempt.test_id },
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
          attributes: ["id", "question_id", "content", "content_type"], // Exclude correct answers
        },
      ],
    });

    // Fetch user answers separately
    const userAnswers = await models.UserAnswer.findAll({
      where: { attempt_id: attemptId },
      attributes: ["question_id", "option_id", "fib_answer"],
    });

    // Fetch mark-for-review status separately
    const reviewStatusList = await models.ReviewStatus.findAll({
      where: { attempt_id: attemptId },
      attributes: ["question_id", "marked_for_review"],
    });

    // Create a map of user answers
    const userAnswerMap = new Map();

    userAnswers.forEach(({ question_id, option_id, fib_answer }) => {
      if (!userAnswerMap.has(question_id)) {
        userAnswerMap.set(question_id, {
          userAnswer: null,
        });
      }

      if (option_id !== null) {
        const currentAnswer = userAnswerMap.get(question_id).userAnswer;
        if (Array.isArray(currentAnswer)) {
          currentAnswer.push(option_id);
        } else if (currentAnswer === null) {
          userAnswerMap.set(question_id, {
            userAnswer: [option_id],
          });
        }
      } else if (fib_answer !== null) {
        userAnswerMap.set(question_id, {
          userAnswer: fib_answer,
        });
      }
    });

    // Create a map of review statuses
    const reviewStatusMap = new Map(
      reviewStatusList.map(({ question_id, marked_for_review }) => [
        question_id,
        marked_for_review,
      ])
    );

    // Structuring the response
    const structuredQuestions = [];
    const passageMap = new Map();

    questions.forEach((question) => {
      const questionData = question.toJSON();
      delete questionData.correct_answer;
      delete questionData.fib_answer;

      // Get user's selected answer
      const userAnswerData = userAnswerMap.get(questionData.id) || {
        userAnswer: null,
      };

      // Get review status
      const markedForReview = reviewStatusMap.get(questionData.id) || false;

      if (questionData.passage_id) {
        // Passage-Based Question
        if (!passageMap.has(questionData.passage_id)) {
          passageMap.set(questionData.passage_id, {
            passage_id: questionData.passageData.id,
            content: questionData.passageData.content,
            content_type: questionData.passageData.content_type,
            questions: [],
          });
          structuredQuestions.push(passageMap.get(questionData.passage_id));
        }
        // Add question inside the passage
        passageMap.get(questionData.passage_id).questions.push({
          id: questionData.id,
          content: questionData.content,
          content_type: questionData.content_type,
          marks: questionData.marks,
          type: questionData.type,
          options: questionData.options, // Options included inside question
          userAnswer: userAnswerData.userAnswer,
          markedForReview,
        });
      } else {
        // Standalone Question
        structuredQuestions.push({
          id: questionData.id,
          content: questionData.content,
          content_type: questionData.content_type,
          marks: questionData.marks,
          type: questionData.type,
          options: questionData.options, // Options included
          userAnswer: userAnswerData.userAnswer,
          markedForReview,
        });
      }
    });

    res.status(200).json({ success: true, data: structuredQuestions });
  } catch (error) {
    console.error("Error fetching test attempt questions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUserAnswersForAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Fetch user answers for this test attempt
    const userAnswers = await models.UserAnswer.findAll({
      where: { attempt_id: attemptId },
      attributes: ["question_id", "option_id", "fib_answer"], // Only user-selected data
    });

    res.status(200).json({ success: true, data: userAnswers });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get paginated question with options
exports.getPaginatedQuestion = async (req, res) => {
  const { attemptId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 1;

  try {
    const attempt = await models.TestAttempt.findByPk(attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const totalQuestions = await models.Question.count({
      where: { test_id: attempt.test_id },
    });

    const totalPages = Math.ceil(totalQuestions / pageSize);

    if (page > totalPages) {
      return res.status(404).json({ message: "No more questions" });
    }

    // Get the paginated question with options
    const question = await models.Question.findOne({
      where: { test_id: attempt.test_id },
      include: [
        {
          model: models.Option,
          as: "options",
          attributes: ["id", "content"], // Include option ID and content
        },
      ],
      order: [["id", "ASC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    // Fetch user's previously selected answer (if any)
    const userAnswer = await models.UserAnswer.findAll({
      where: { attempt_id: attemptId, question_id: question.id },
      attributes: ["option_id", "fib_answer", "marked_for_review"],
    });

    let selectedAnswer = null;
    let markedForReview = false;

    if (question.type === "single_choice") {
      selectedAnswer = userAnswer.length ? userAnswer[0].option_id : null;
    } else if (question.type === "multiple_choice") {
      selectedAnswer = userAnswer.map((ans) => ans.option_id);
    } else if (question.type === "fill_in_the_blank") {
      selectedAnswer = userAnswer.length ? userAnswer[0].fib_answer : "";
    }
    // Extract marked_for_review flag
    if (userAnswer.length > 0) {
      markedForReview = userAnswer[0].marked_for_review;
    }

    console.log(userAnswer);

    res.json({
      currentPage: page,
      totalPages,
      question: {
        id: question.id,
        content: question.content,
        type: question.type,
        options: question.options,
      },
      selectedAnswer,
      markedForReview,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save user answer
exports.saveAnswer = async (req, res) => {
  const { attemptId } = req.params;
  const { question_id, answer } = req.body; // Answer can be option ID (single choice), array (multiple choice), or text (FIB)

  try {
    const question = await models.Question.findByPk(question_id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const existingAnswer = await models.UserAnswer.findOne({
      where: { attempt_id: attemptId, question_id },
    });

    if (question.type === "single_choice") {
      // **Single Choice:** If exists, update it; otherwise, create new
      if (existingAnswer) {
        await existingAnswer.update({
          option_id: answer,
          fib_answer: null,
        });
      } else {
        await models.UserAnswer.create({
          attempt_id: attemptId,
          question_id,
          option_id: answer,
          fib_answer: null,
        });
      }
    } else if (question.type === "multiple_choice") {
      // **Multiple Choice:** Only update changes (add/remove options)
      const existingOptions = await models.UserAnswer.findAll({
        where: { attempt_id: attemptId, question_id },
      });

      const existingOptionIds = existingOptions.map((ans) => ans.option_id);
      const newOptionIds = answer; // Array of selected options

      const optionsToAdd = newOptionIds.filter(
        (opt) => !existingOptionIds.includes(opt)
      );
      const optionsToRemove = existingOptionIds.filter(
        (opt) => !newOptionIds.includes(opt)
      );

      // Add only new selections
      await Promise.all(
        optionsToAdd.map((optionId) =>
          models.UserAnswer.create({
            attempt_id: attemptId,
            question_id,
            option_id: optionId,
            fib_answer: null,
          })
        )
      );

      // Remove only unselected options
      if (optionsToRemove.length > 0) {
        await models.UserAnswer.destroy({
          where: {
            attempt_id: attemptId,
            question_id,
            option_id: optionsToRemove,
          },
        });
      }
    } else if (question.type === "fill_in_the_blank") {
      // **Fill in the Blank:** If exists, update it; otherwise, create new
      if (existingAnswer) {
        await existingAnswer.update({
          fib_answer: answer,
          selected_option: null,
        });
      } else {
        await models.UserAnswer.create({
          attempt_id: attemptId,
          question_id,
          fib_answer: answer,
          option_id: null,
        });
      }
    }

    return res.json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error("Error saving answer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.clearAnswer = async (req, res) => {
  const { attemptId } = req.params;
  const { question_id } = req.body;

  try {
    // Ensure attemptId and question_id are provided
    if (!attemptId || !question_id) {
      return res
        .status(400)
        .json({ message: "Attempt ID and Question ID are required." });
    }

    // Update the answer instead of deleting it
    await models.UserAnswer.update(
      { option_id: null, fib_answer: null }, // Set values to null
      { where: { attempt_id: attemptId, question_id } }
    );

    return res.json({ message: "Answer cleared successfully" });
  } catch (error) {
    console.error("Error clearing answer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.markForReview = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { question_id, marked_for_review } = req.body;

    if (!attemptId || !question_id || marked_for_review === undefined) {
      return res.status(400).json({
        message: "attemptId, question_id, and marked_for_review are required",
      });
    }

    // Update or insert the marked status
    const [review] = await models.ReviewStatus.upsert(
      { attempt_id: attemptId, question_id, marked_for_review },
      { returning: true }
    );

    res.status(200).json({
      message: marked_for_review
        ? "Question marked for review"
        : "Question unmarked from review",
      data: review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit test and calculate score
exports.submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Fetch the test attempt with user answers
    const attempt = await models.TestAttempt.findByPk(attemptId, {
      include: [{ model: models.UserAnswer }],
    });
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }
    // Fetch the associated test to get total marks and negative marking

    const test = await models.Test.findByPk(attempt.test_id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    const userAnswersMap = new Map();

    for (const answer of attempt.UserAnswers) {
      if (!userAnswersMap.has(answer.question_id)) {
        userAnswersMap.set(answer.question_id, []);
      }

      if (answer.option_id !== null) {
        // Store multiple options in an array
        userAnswersMap.get(answer.question_id).push(answer.option_id);
      } else {
        // Store FIB answer as a string
        userAnswersMap.set(answer.question_id, answer.fib_answer);
      }
    }

    const correctAnswersMap = new Map();

    const questions = await models.Question.findAll({
      where: { test_id: attempt.test_id },
    });

    for (const question of questions) {
      if (
        question.type === "multiple_choice" ||
        question.type === "single_choice"
      ) {
        const correctOptions = await models.AnswersMCQMSQ.findAll({
          where: { question_id: question.id },
        });
        const correctOptionIds = correctOptions.map((opt) => opt.option_id);
        correctAnswersMap.set(question.id, correctOptionIds);
      } else if (question.type === "fill_in_the_blank") {
        const correctAnswer = await models.AnswersFib.findOne({
          where: { question_id: question.id },
        });
        if (correctAnswer) {
          correctAnswersMap.set(question.id, correctAnswer.correctTextAnswer);
        }
      }
    }

    let marksGained = 0;
    let negativeMarks = 0;

    // Loop through user answers
    for (const [questionId, userResponse] of userAnswersMap.entries()) {
      const question = await models.Question.findByPk(questionId);

      if (!question) continue; // Skip if question is not found

      const correctAnswer = correctAnswersMap.get(questionId);

      if (question.type === "single_choice") {
        // Single Choice: Check if selected option matches the correct one
        if (correctAnswer.includes(userResponse[0])) {
          marksGained += question.marks;
        } else {
          negativeMarks += test.negative; // Apply test-level negative marking
        }
      } else if (question.type === "multiple_choice") {
        // Multiple Choice: Compare selected options with correct ones
        const userSelectedOptions = new Set(userResponse);
        const correctOptionIds = new Set(correctAnswer);

        if (
          userSelectedOptions.size === correctOptionIds.size &&
          [...userSelectedOptions].every((opt) => correctOptionIds.has(opt))
        ) {
          marksGained += question.marks; // Fully correct, gain marks
        } else {
          negativeMarks += test.negative; // Deduct once per wrong question
        }
      } else if (question.type === "fill_in_the_blank") {
        // Fill-in-the-blank: Compare case-insensitive answer
        if (userResponse && correctAnswer) {
          if (correctAnswer.toLowerCase() === userResponse.toLowerCase()) {
            marksGained += question.marks;
          } else {
            negativeMarks += test.negative;
          }
        }
      }
    }

    // Calculate final score
    const finalScore = marksGained - negativeMarks;

    console.log(userAnswersMap);
    console.log(correctAnswersMap);
    console.log(marksGained);
    console.log(negativeMarks);
    console.log(finalScore);

    await attempt.update({
      total_marks: test.totalMarks, // Use totalMarks from the Test model
      marks_gained: marksGained,
      negative_marks: negativeMarks,
      final_score: finalScore, // Final score after deduction
      attempted_questions: userAnswersMap.size,
      status: "completed",
      end_time: new Date(),
    });

    res.json({
      message: "Test submitted successfully",
      total_marks: test.totalMarks, // Use totalMarks from the Test model
      marks_gained: marksGained,
      negative_marks: negativeMarks,
      final_score: finalScore, // Final score after subtracting negative marks
      attempted_questions: userAnswersMap.size,
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTestAttemptStats = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Fetch attempt details
    const attempt = await models.TestAttempt.findByPk(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Get total questions for the test
    const totalQuestions = await models.Question.count({
      where: { test_id: attempt.test_id },
    });

    // Get attempted questions: Count DISTINCT question_id where option_id OR fib_answer is not null
    const attemptedQuestions = await models.UserAnswer.count({
      where: {
        attempt_id: attemptId,
        [Op.or]: [
          // ✅ Use `Op` correctly
          { option_id: { [Op.ne]: null } },
          { fib_answer: { [Op.ne]: null } },
        ],
      },
      distinct: true,
      col: "question_id",
    });

    // Get questions marked for review
    const markedForReview = await models.ReviewStatus.count({
      where: { attempt_id: attemptId, marked_for_review: true },
      distinct: true,
      col: "question_id",
    });

    // Unanswered questions = Total questions - Attempted questions
    const unansweredQuestions = totalQuestions - attemptedQuestions;

    res.json({
      totalQuestions,
      attemptedQuestions,
      markedForReview,
      unansweredQuestions,
    });
  } catch (error) {
    console.error("Error fetching test attempt stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTestResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.user.userId;
    // Fetch the test attempt (with pre-calculated stats)
    const testAttempt = await models.TestAttempt.findOne({
      where: { id: attemptId, user_id: userId },
      attributes: [
        "test_id",
        "total_marks",
        "marks_gained",
        "attempted_questions",
        "final_score",
        "negative_marks",
      ],
    });

    if (!testAttempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    const test = await models.Test.findByPk(testAttempt.test_id);

    // Fetch all questions (order maintained)
    const questions = await models.Question.findAll({
      where: { test_id: testAttempt.test_id },
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
          attributes: ["id", "question_id", "content", "content_type"],
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

    // Fetch user answers
    const userAnswers = await models.UserAnswer.findAll({
      where: { attempt_id: attemptId },
      attributes: ["question_id", "option_id", "fib_answer"],
    });

    // Fetch marked for review data
    const reviewStatuses = await models.ReviewStatus.findAll({
      where: { attempt_id: attemptId },
      attributes: ["question_id", "marked_for_review"],
    });

    // Map user answers and review statuses
    const userAnswerMap = new Map();
    userAnswers.forEach((answer) => {
      if (!userAnswerMap.has(answer.question_id)) {
        userAnswerMap.set(answer.question_id, []);
      }
      userAnswerMap
        .get(answer.question_id)
        .push(answer.option_id || answer.fib_answer);
    });

    const reviewMap = new Map();
    reviewStatuses.forEach((review) => {
      reviewMap.set(review.question_id, review.marked_for_review);
    });

    // Structuring the response
    const structuredQuestions = [];
    const passageMap = new Map();

    questions.forEach((question) => {
      const questionData = question.toJSON();
      const correctAnswers =
        questionData.options?.flatMap((opt) =>
          opt.correct_answer ? [opt.id] : []
        ) || [];
      const userAnswerData = userAnswerMap.get(questionData.id) || [];
      const isMarkedForReview = reviewMap.get(questionData.id) || false;

      const formattedQuestion = {
        id: questionData.id,
        content: questionData.content,
        content_type: questionData.content_type,
        marks: questionData.marks,
        negative_marks: questionData.negative_marks,
        type: questionData.type,
        options: questionData.options,
        explanation: questionData.explanation,
        correctAnswers: correctAnswers,
        fib_answer: questionData.fib_answer
          ? questionData.fib_answer.correctTextAnswer
          : null,
        userAnswer: userAnswerData,
        markedForReview: isMarkedForReview,
      };

      if (questionData.passage_id) {
        if (!passageMap.has(questionData.passage_id)) {
          passageMap.set(questionData.passage_id, {
            passage_id: questionData.passageData.id,
            content: questionData.passageData.content,
            content_type: questionData.passageData.content_type,
            questions: [],
          });
          structuredQuestions.push(passageMap.get(questionData.passage_id));
        }
        passageMap
          .get(questionData.passage_id)
          .questions.push(formattedQuestion);
      } else {
        structuredQuestions.push(formattedQuestion);
      }
    });

    res.status(200).json({
      success: true,
      data: structuredQuestions,
      test: test,
      stats: {
        total_marks: testAttempt.total_marks,
        marks_gained: testAttempt.marks_gained,
        total_questions: questions.length,
        attempted_questions: testAttempt.attempted_questions,
        final_score: testAttempt.final_score,
        negative_marks: testAttempt.negative_marks,
      },
    });
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getInProgressTests = async (req, res) => {
  try {
    const userId = req.user?.user?.userId; // Extract user ID from request

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const inProgressTests = await models.TestAttempt.findAll({
      where: { status: "in_progress", user_id: userId },
      include: {
        model: models.Test,
        attributes: ["id", "name", "duration", "totalMarks", "difficulty"],
      },
    });

    return res.status(200).json({ success: true, data: inProgressTests });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getCompletedTests = async (req, res) => {
  try {
    const userId = req.user?.user?.userId; // Extract user ID from request

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Pagination parameters
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 8; // Default: 8 tests per page
    const offset = (page - 1) * limit;

    // Get total count of completed tests
    const totalCount = await models.TestAttempt.count({
      where: { status: "completed", user_id: userId },
    });

    // Fetch paginated completed tests
    const completedTests = await models.TestAttempt.findAll({
      where: { status: "completed", user_id: userId },
      include: {
        model: models.Test,
        attributes: ["id", "name", "duration", "totalMarks", "difficulty"],
      },
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: completedTests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
