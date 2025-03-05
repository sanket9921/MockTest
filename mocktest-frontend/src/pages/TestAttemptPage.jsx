import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigation from "../components/QuestionNavigation";
import { motion } from "framer-motion";
import {
  // getPaginatedQuestion,
  markQuestionForReview,
  saveUserAnswer,
  submitTest,
} from "../services/testAttemptService";
// import SubmitButton from "../components/SubmitButton";
import TestAttemptLayout from "../components/TestAttempt/TestAttemptLayout";

const TestAttemptPage = () => {
  const { attemptId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [question, setQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(false);

  // useEffect(() => {
  //   const page = parseInt(searchParams.get("page")) || 1;
  //   setCurrentPage(page);
  //   fetchQuestion(page);
  // }, [searchParams]);

  // const fetchQuestion = async (page) => {
  //   try {
  //     const response = await getPaginatedQuestion(attemptId, page);
  //     setQuestion(response.question);
  //     setTotalPages(response.totalPages);
  //     setSelectedAnswer(response.selectedAnswer);
  //     setMarkedForReview(response.markedForReview);
  //   } catch (error) {
  //     console.error("Error fetching question:", error);
  //   }
  // };

  const handleAnswerChange = async (answer) => {
    console.log(answer);
    setSelectedAnswer(answer);
    await saveUserAnswer(attemptId, question.id, answer);
  };

  const handleNavigation = (page) => {
    setSearchParams({ page });
  };

  const handleSubmit = async () => {
    await submitTest(attemptId);
  };

  const handleMarkForReview = async (questionId) => {
    await markQuestionForReview(attemptId, questionId, !markedForReview);
    setMarkedForReview((prev) => !prev); // Update UI instantly
  };

  return (
    <motion.div className="min-h-screen flex flex-col bg-blue-50 p-6">
      {/* Timer (If applicable) */}
      <div className="text-center text-lg font-semibold text-blue-600">
        Time Remaining: 20:30
      </div>

      <TestAttemptLayout attemptId={attemptId} />

      {/* Question Card */}
      {/* {question && (
        <QuestionCard
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerChange={handleAnswerChange}
        />
      )} */}

      {/* Navigation */}
      {/* <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 rounded ${
            currentPage > 1
              ? "bg-blue-500 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={currentPage === 1}
          onClick={() => handleNavigation(currentPage - 1)}
        >
          Back
        </button>
        <button
          className={`px-4 py-2 rounded ${
            markedForReview ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleMarkForReview(question.id)}
        >
          {markedForReview ? "Unmark Review" : "Mark for Review"}
        </button>

        {currentPage < totalPages ? (
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white"
            onClick={() => handleNavigation(currentPage + 1)}
          >
            Next
          </button>
        ) : (
          <SubmitButton attemptId={attemptId} onSubmit={handleSubmit} />
        )}
      </div> */}

      {/* Question Navigation */}
      {/* <QuestionNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      /> */}
    </motion.div>
  );
};

export default TestAttemptPage;
