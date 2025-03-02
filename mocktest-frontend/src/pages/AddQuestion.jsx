import { useParams } from "react-router-dom";
import QuestionList from "../components/QuestionList";
import { useEffect, useState } from "react";
import { fetchQuestionsByTestId } from "../services/questionService";
import QuestionManager from "../components/Forms/QuestionManager";

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
    <div className="container flex">
      <QuestionList
        questions={questions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        refreshQuestions={refreshQuestions}
      />
      <QuestionManager
        testId={parseInt(testid)}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        refreshQuestions={refreshQuestions}
      />
    </div>
  );
};

export default AddQuestion;
