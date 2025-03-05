import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTestDetails } from "../services/testService.";
import { startTestAttempt } from "../services/testAttemptService";

const RulePage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTestDetails(testId);
        setTestDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [testId]);

  const handleStartTest = async () => {
    try {
      const attemptId = await startTestAttempt(testId);
      navigate(`/attempt/${attemptId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-blue-600 text-center">
        {testDetails.name} - Rules
      </h2>
      <ul className="mt-4 text-gray-700 space-y-2">
        <li>📌 Number of Questions: {testDetails.questionCount}</li>
        {testDetails.duration && (
          <li>⏳ Time Limit: {testDetails.duration} mins</li>
        )}
        <li>🎯 Total Marks: {testDetails.totalMarks}</li>
        <li>⚠️ You must complete the test once started.</li>
      </ul>
      <button
        onClick={handleStartTest}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 transition-all duration-300"
      >
        Start Test
      </button>
    </motion.div>
  );
};

export default RulePage;
