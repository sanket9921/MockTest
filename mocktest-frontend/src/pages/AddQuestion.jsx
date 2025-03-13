import { useParams } from "react-router-dom";
import QuestionList from "../components/QuestionList";
import { useEffect, useState } from "react";
import { fetchQuestionsByTestId } from "../services/questionService";
import QuestionManager from "../components/Forms/QuestionManager";
import Navbar from "../components/Header";

const AddQuestion = () => {
  const { testid } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Fetch questions when the page loads
  useEffect(() => {
    refreshQuestions();
  }, []);

  // Function to refresh questions
  const refreshQuestions = async () => {
    const data = await fetchQuestionsByTestId(testid);
    setQuestions(data);
  };

  return (
    <div className="container-fluid">
      <div className="my-3">
        <Navbar />
      </div>
      <div className="row">
        {/* Left Column - Question List (50%) */}
        <div className="col-md-6">
          <QuestionList
            questions={questions}
            refreshQuestions={refreshQuestions}
          />
        </div>

        {/* Right Column - Question Manager (50%) */}
        <div className="col-md-6">
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
