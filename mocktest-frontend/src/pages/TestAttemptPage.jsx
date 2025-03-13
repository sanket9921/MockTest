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
    <div className="container">
      <TestAttemptLayout attemptId={attemptId} />
    </div>
  );
};

export default TestAttemptPage;
