import { useState, useEffect } from "react";
import QuestionDisplay from "./QuestionDisplay";
import QuestionNavigator from "./QuestionNavigator";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const fetchQuestions = async () => {
    try {
      const data = await getTestAttsemptQuestions(attemptId);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  // Fetch Questions
  useEffect(() => {
    fetchQuestions();
  }, [attemptId]);

  // Save Answer
  const handleSaveAnswer = async (questionId, answer) => {
    await saveUserAnswer(attemptId, questionId, answer);
    fetchQuestions();
  };

  // Navigation
  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitTest = async () => {
    await submitTest(attemptId);
    console.log("test submitted");
  };

  const handleMarkForReview = async () => {
    console.log(questions[currentQuestionIndex]);
    if (questions[currentQuestionIndex].passage_id) {
      await markQuestionForReview(
        attemptId,
        questions[currentQuestionIndex].questions[0]?.id,
        !questions[currentQuestionIndex].questions[0]?.markedForReview
      );
    } else {
      await markQuestionForReview(
        attemptId,
        questions[currentQuestionIndex]?.id,
        !questions[currentQuestionIndex]?.markedForReview
      );
    }
    fetchQuestions();
  };

  const handleClearAnswer = async (questionId) => {
    // if (questions[currentQuestionIndex].passage_id){
    //   await clearAnswer(attemptId,questions[currentQuestionIndex].que)
    // }

    await clearAnswer(attemptId, questionId);
    fetchQuestions();
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Timer attemptId={attemptId} onTimeUp={handleSubmitTest} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Question Display */}
        <QuestionDisplay
          questionData={questions[currentQuestionIndex]}
          onSaveAnswer={handleSaveAnswer}
          onClear={handleClearAnswer}
        />

        {/* Question Navigator */}
        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={handleQuestionNavigation}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full p-4 bg-white shadow-md flex justify-between items-center">
        {/* Previous Button */}
        <button
          onClick={() => handleQuestionNavigation(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {/* Mark for Review */}
        <button
          onClick={handleMarkForReview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {(() => {
            const currentQuestion = questions[currentQuestionIndex];

            // If it's a passage-based question, check the first question inside
            if (currentQuestion?.questions) {
              return currentQuestion.questions[0]?.markedForReview
                ? "Unmark Review"
                : "Mark for Review";
            }

            // If it's a standalone question
            return currentQuestion?.markedForReview
              ? "Unmark Review"
              : "Mark for Review";
          })()}
        </button>

        {/* Next / Submit */}
        {currentQuestionIndex === questions.length - 1 ? (
          // <button
          //   onClick={handleSubmitTest}
          //   className="px-4 py-2 bg-red-500 text-white rounded"
          // >
          //   Submit Test
          // </button>
          <SubmitButton attemptId={attemptId} onSubmit={handleSubmitTest} />
        ) : (
          <button
            onClick={() => handleQuestionNavigation(currentQuestionIndex + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TestAttemptLayout;
