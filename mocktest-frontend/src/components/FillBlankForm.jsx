import { useState } from "react";
import { submitQuestion } from "../services/questionService";

const FillBlankForm = ({ testId }) => {
  const [question, setQuestion] = useState({
    content: "",
    content_type: "text",
    marks: 1,
  });
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = async () => {
    const data = {
      test_id: testId,
      ...question,
      question_type: "fill_in_the_blank",
      correct_answers: correctAnswer,
    };
    await submitQuestion(data);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter question"
        className="w-full p-2 border"
        onChange={(e) => setQuestion({ ...question, content: e.target.value })}
      />
      <input
        type="number"
        placeholder="Marks"
        className="w-full p-2 border"
        onChange={(e) => setQuestion({ ...question, marks: e.target.value })}
      />
      <input
        type="text"
        placeholder="Correct Answer"
        className="w-full p-2 border"
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default FillBlankForm;
