import { useParams } from "react-router-dom";
import QuestionList from "../components/QuestionList";
import { useEffect, useState } from "react";
import { fetchQuestionsByTestId } from "../services/questionService";
import QuestionManager from "../components/Forms/QuestionManager";
import Navbar from "../components/Header";
import { getTestDetails } from "../services/testService.";

const AddQuestion = () => {
  const { testid } = useParams();
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);

  // Fetch questions when the page loads
  useEffect(() => {
    refreshQuestions();
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    setTimeout(async () => {
      const data = await getTestDetails(testid);
      setTest(data);
    }, 100);
  };

  // Function to refresh questions
  const refreshQuestions = async () => {
    fetchTestDetails();
    const data = await fetchQuestionsByTestId(testid);
    setQuestions(data);
  };

  return (
    <div className="container-fluid">
      <div className="my-3"></div>
      <div className="row">
        {/* Left Column - Question List (50%) */}
        <div className="col-md-6">
          <QuestionList
            test={test}
            questions={questions}
            refreshQuestions={refreshQuestions}
          />
        </div>

        {/* Right Column - Question Manager (50%) */}
        <div className="col-md-6 overflow-y-auto h-100">
          <QuestionManager
            testId={parseInt(testid)}
            refreshQuestions={refreshQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
