import { useState, useEffect } from "react";
import QuestionDisplay from "./QuestionDisplay";
import QuestionNavigator from "./QuestionNavigator";
import { useNavigate } from "react-router-dom";

import {
  clearAnswer,
  getTestAttsemptQuestions,
  markQuestionForReview,
  saveUserAnswer,
  submitTest,
} from "../../services/testAttemptService";
import SubmitButton from "./SubmitButton";
import Timer from "./Timer";

const TestAttemptLayout = ({ attemptId }) => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const fetchQuestions = async () => {
    try {
      const data = await getTestAttsemptQuestions(attemptId);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [attemptId]);

  const handleSaveAnswer = async (questionId, answer) => {
    await saveUserAnswer(attemptId, questionId, answer);
    fetchQuestions();
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitTest = async () => {
    await submitTest(attemptId);
    navigate("/result/" + attemptId);
  };

  const handleMarkForReview = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion?.passage_id) {
      await markQuestionForReview(
        attemptId,
        currentQuestion.questions[0]?.id,
        !currentQuestion.questions[0]?.markedForReview
      );
    } else {
      await markQuestionForReview(
        attemptId,
        currentQuestion?.id,
        !currentQuestion?.markedForReview
      );
    }
    fetchQuestions();
  };

  const handleClearAnswer = async (questionId) => {
    await clearAnswer(attemptId, questionId);
    fetchQuestions();
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid my-5 mx-auto w-full">
      {/* Main Content */}
      <div className="d-flex justify-content-between gap-3">
        {/* Left Section - Question Display */}
        <div className="flex-grow-1">
          {/* Timer & Marking Info inside Question Display */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Timer on the Left */}
            <div>
              <Timer attemptId={attemptId} onTimeUp={handleSubmitTest} />
            </div>

            {/* Mark and Negative Mark on the Right */}
            <div className="d-flex">
              <span className="px-3 py-1 text-white rounded-start-pill bg-success d-flex align-items-center gap-1">
                <i className="bi bi-check"></i> 1
              </span>
              <span className="px-3 py-1 text-white rounded-end-pill bg-danger d-flex align-items-center gap-1">
                <i className="bi bi-x"></i> 0
              </span>
            </div>
          </div>

          {/* Question Display */}
          <QuestionDisplay
            questionData={questions[currentQuestionIndex]}
            onSaveAnswer={handleSaveAnswer}
            onClear={handleClearAnswer}
          />

          {/* Fixed Navigation Buttons inside Question Display Column */}
          <div className="position-fixed bottom-0 start-0 w-100 d-flex justify-content-center">
            <div className="w-75 bg-white p-3 border-top d-flex justify-content-between">
              {/* Previous Button (Left-Aligned) */}
              <button
                onClick={() =>
                  handleQuestionNavigation(currentQuestionIndex - 1)
                }
                disabled={currentQuestionIndex === 0}
                className="btn btn-secondary"
              >
                Previous
              </button>

              {/* Mark for Review Button (Centered) */}
              <button
                onClick={handleMarkForReview}
                className="btn btn-warning mx-auto"
              >
                {questions[currentQuestionIndex]?.markedForReview
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>

              {/* Next or Submit Button (Right-Aligned) */}
              {currentQuestionIndex === questions.length - 1 ? (
                <SubmitButton
                  attemptId={attemptId}
                  onSubmit={handleSubmitTest}
                />
              ) : (
                <button
                  onClick={() =>
                    handleQuestionNavigation(currentQuestionIndex + 1)
                  }
                  className="btn btn-primary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Question Navigator (Only on Large Screens) */}
        <div className="d-none d-md-block">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onNavigate={handleQuestionNavigation}
          />
        </div>
      </div>

      {/* Show Question Navigator in horizontal scroll mode for small screens */}
      <div className="d-block d-md-none w-100 overflow-auto mt-3">
        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={handleQuestionNavigation}
        />
      </div>
    </div>
  );
};

export default TestAttemptLayout;
