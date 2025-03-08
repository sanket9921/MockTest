import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionList from "../components/Result/QuestionList";
import { getResult } from "../services/testAttemptService";

const ResultPage = () => {
  const { attemptId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await getResult(attemptId);
        setResultData(response.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  if (!resultData)
    return <p className="text-center text-red-500">No data found.</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Score Summary */}
      <motion.div
        className="bg-gray-100 p-6 rounded-lg shadow-md text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Test Result</h2>
        {/* <p className="text-lg">
          Score: {userScore} / {totalMarks}
        </p>
        <p className="text-lg">
          Correct Answers: {correctAnswers} / {totalQuestions}
        </p> */}
      </motion.div>

      {/* Questions List */}
      <QuestionList questions={resultData} />
    </div>
  );
};

export default ResultPage;
