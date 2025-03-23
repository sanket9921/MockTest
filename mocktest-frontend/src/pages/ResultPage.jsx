import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionList from "../components/Result/QuestionList";
import { getResult } from "../services/testAttemptService";
import StatsSummary from "../components/Result/StatsSummary";
import Navbar from "../components/Header";
import SimilarTest from "../components/Result/SimilarTest";

const ResultPage = () => {
  const { attemptId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await getResult(attemptId);
        setResultData(response);
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
    <>
      <div className="mt-3">
        <Navbar />
      </div>
      <div className="container mx-auto p-6 my-5">
        {/* Test Result Header */}
        <div className="m-6 p-6">
          <h2 className="text-dark m-6 p-6">
            Result <span>{resultData.test.name}</span>{" "}
          </h2>
        </div>

        {/* Stats Summary */}
        <StatsSummary stats={resultData.stats} className="my-5" />

        {/* Questions List */}
        <QuestionList questions={resultData} />
      </div>
    </>
  );
};

export default ResultPage;
