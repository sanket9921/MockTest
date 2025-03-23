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
    <div className="container my-5 mx-auto">
      {/* Show Question Navigator in horizontal scroll mode for small screens */}
      <div className="d-block d-md-none w-100 overflow-auto">
        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={handleQuestionNavigation}
        />
      </div>

      {/* Main Layout - 70-30 Split for Medium & Large Screens */}
      <div className="row g-3">
        {/* Left Section - 70% width on medium & large screens */}
        <div className="col-12 col-md-8">
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
            <div className="custom-width bg-white p-3 d-flex justify-content-between">
              {/* Previous Button (Left-Aligned) */}
              <button
                onClick={() =>
                  handleQuestionNavigation(currentQuestionIndex - 1)
                }
                disabled={currentQuestionIndex === 0}
                className="btn btn-fluid btn-secondary"
              >
                Previous
              </button>

              {/* Mark for Review Button (Centered) */}
              <button
                onClick={handleMarkForReview}
                className="btn text-black fs-6 bg-lightblue mx-auto"
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
                  className="btn btn-primary "
                >
                  <span>
                    Next
                    <i class="bi bi-arrow-right"></i>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - 30% width on medium & large screens (Hidden on Small Screens) */}
        <div className="col-md-4 d-none d-md-block">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onNavigate={handleQuestionNavigation}
          />
        </div>
      </div>
    </div>
  );
};

export default TestAttemptLayout;
