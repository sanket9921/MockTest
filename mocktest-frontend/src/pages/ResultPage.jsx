import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionList from "../components/Result/QuestionList";
import { getResult } from "../services/testAttemptService";
import StatsSummary from "../components/Result/StatsSummary";

const ResultPage = () => {
  const { attemptId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await getResult(attemptId);
        setResultData(response);

        // Ensure data exists before processing
        if (response?.data) {
          const count = countCorrectAnswers(response.data);
          setCorrectAnswersCount(count);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  function countCorrectAnswers(data) {
    let count = 0;

    data.forEach((item) => {
      if (item.passage_id && item.questions) {
        // ✅ Handle passage-based questions
        item.questions.forEach((question) => {
          if (
            question.correctAnswers?.length > 0 &&
            question.userAnswer?.length > 0 &&
            JSON.stringify(question.correctAnswers.sort()) ===
              JSON.stringify(question.userAnswer.sort())
          ) {
            count++;
          }
        });
      } else if (item.type === "fill_in_the_blank") {
        if (item.fib_answer === item.userAnswer[0]) {
          count++;
        }
      } else if (
        item.correctAnswers?.length > 0 &&
        item.userAnswer?.length > 0 &&
        JSON.stringify(item.correctAnswers.sort()) ===
          JSON.stringify(item.userAnswer.sort())
      ) {
        // ✅ Handle normal (non-passage) questions
        count++;
      }
    });

    return count;
  }

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!resultData)
    return <p className="text-center text-red-500">No data found.</p>;

  return (
    <>
      <div className="container mx-auto p-6 my-5">
        {/* Test Result Header */}
        <div className="m-6 p-6">
          <h2 className="text-dark m-6 p-6">
            Result <span>{resultData.test?.name}</span>{" "}
          </h2>
        </div>

        {/* Stats Summary */}
        <StatsSummary
          stats={resultData.stats}
          correctAnswers={correctAnswersCount}
          className="my-5"
        />

        {/* Questions List */}
        <QuestionList questions={resultData} />
      </div>
    </>
  );
};

export default ResultPage;
