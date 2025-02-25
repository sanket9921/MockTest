const { models } = require("../models");

exports.startTestAttempt = async (req, res) => {
  const { testId } = req.params;
  const userId = req.body.user_id;

  const attempt = await models.TestAttempt.create({
    user_id: userId,
    test_id: testId,
  });
  res.json({ attemptId: attempt.id, message: "Test started" });
};

// Get paginated question with options
exports.getPaginatedQuestion = async (req, res) => {
  const { attemptId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 1; // Show one question at a time

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

exports.markForReview = async (req, res) => {
  const { attemptId } = req.params;
  const { question_id, marked_for_review } = req.body; // Only handling review marking

  try {
    const existingAnswer = await models.UserAnswer.findOne({
      where: { attempt_id: attemptId, question_id },
    });

    if (!existingAnswer) {
      // If no answer exists, create an empty one just for marking review
      await models.UserAnswer.create({
        attempt_id: attemptId,
        question_id,
        option_id: null,
        fib_answer: null,
        marked_for_review,
      });
    } else {
      // Just update the review status
      await existingAnswer.update({ marked_for_review });
    }

    return res.json({ message: "Marked for review updated successfully" });
  } catch (error) {
    console.error("Error marking for review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Submit test and calculate score
exports.submitTest = async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await models.TestAttempt.findByPk(attemptId, {
    include: [{ model: models.UserAnswer }],
  });

  if (!attempt) return res.status(404).json({ message: "Attempt not found" });

  let totalScore = 0;

  for (const answer of attempt.UserAnswers) {
    const question = await models.Question.findByPk(answer.question_id);
    if (!question) continue;

    if (
      question.type === "single_choice" ||
      question.type === "multiple_choice"
    ) {
      const correctOptions = await models.AnswersMCQMSQ.findAll({
        where: { question_id: question.id },
      });
      const correctOptionIds = correctOptions.map((opt) => opt.option_id);

      if (question.type === "single_choice") {
        if (correctOptionIds.includes(answer.option_id))
          totalScore += question.marks;
      } else if (question.type === "multiple_choice") {
        const userSelectedOptions = await models.UserAnswer.findAll({
          where: { attempt_id: attempt.id, question_id: question.id },
        });
        const userOptionIds = userSelectedOptions.map((ans) => ans.option_id);

        if (
          JSON.stringify(userOptionIds.sort()) ===
          JSON.stringify(correctOptionIds.sort())
        ) {
          totalScore += question.marks;
        }
      }
    } else if (question.type === "fill_in_the_blank") {
      const correctAnswer = await models.AnswersFib.findOne({
        where: { question_id: question.id },
      });
      if (
        correctAnswer &&
        correctAnswer.correctTextAnswer.toLowerCase() ===
          answer.fib_answer.toLowerCase()
      ) {
        totalScore += question.marks;
      }
    }
  }

  await attempt.update({
    total_score: totalScore,
    status: "completed",
    end_time: new Date(),
  });

  res.json({ message: "Test submitted", finalScore: totalScore });
};

// Get test result
exports.getResult = async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await models.TestAttempt.findByPk(attemptId);

  if (!attempt) return res.status(404).json({ message: "Attempt not found" });

  res.json({ testId: attempt.test_id, finalScore: attempt.total_score });
};

exports.getTestAttemptStats = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await models.TestAttempt.findByPk(attemptId, {
      include: [{ model: models.UserAnswer }],
    });
    // Get total questions for the test
    const totalQuestions = await models.Question.count({
      where: { test_id: attempt.test_id },
    });

    // Get attempted questions (questions with saved answers)
    const attemptedQuestions = await models.UserAnswer.count({
      where: { attempt_id: attemptId },
    });

    // // Get questions marked for review
    const markedForReview = await models.UserAnswer.count({
      where: { attempt_id: attemptId, marked_for_review: true },
    });

    // Unanswered questions = Total questions - Attempted
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
