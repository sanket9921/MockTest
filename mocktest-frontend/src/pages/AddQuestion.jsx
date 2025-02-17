import { useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";

const AddQuestion = () => {
  const { testid } = useParams();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Question</h2>
      <QuestionForm testId={parseInt(testid)} />
    </div>
  );
};

export default AddQuestion;
