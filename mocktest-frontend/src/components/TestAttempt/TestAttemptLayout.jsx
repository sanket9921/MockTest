import { useState, useEffect } from "react";
import QuestionDisplay from "./QuestionDisplay";
import QuestionNavigator from "./QuestionNavigator";
import {
  getTestAttsemptQuestions,
  saveUserAnswer,
  submitTest,
} from "../../services/testAttemptService";
import SubmitButton from "./SubmitButton";

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

  // Clear Answer
  const handleClearAnswer = () => {
    const questionId = questions[currentQuestionIndex]?.id;
    if (questionId) {
      handleSaveAnswer(questionId, null);
    }
  };

  const handleSubmitTest = async () => {
    await submitTest(attemptId);
    console.log("test submitted");
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Question Display */}
        <QuestionDisplay
          questionData={questions[currentQuestionIndex]}
          userAnswer={userAnswers[questions[currentQuestionIndex]?.id]}
          onSaveAnswer={handleSaveAnswer}
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

        {/* Clear Answer */}
        <button
          onClick={handleClearAnswer}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Clear
        </button>

        {/* Mark for Review */}
        <button
          onClick={() =>
            handleSaveAnswer(questions[currentQuestionIndex]?.id, "review")
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Mark for Review
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
