import { useState } from "react";
import OptionInput from "./OptionInput";
import { submitQuestion } from "../services/questionService";

const MCQForm = ({ testId }) => {
  const [question, setQuestion] = useState({
    content: "",
    content_type: "text",
    marks: 1,
  });
  const [options, setOptions] = useState([
    { content: "", content_type: "text" },
    { content: "", content_type: "text" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleSubmit = async () => {
    const data = {
      test_id: testId,
      ...question,
      question_type: "single_choice",
      options,
      correct_answers: [correctAnswer],
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
        onChange={(e) =>
          setQuestion({ ...question, marks: parseInt(e.target.value) })
        }
      />

      {options.map((option, index) => (
        <OptionInput
          key={index}
          index={index}
          option={option}
          options={options}
          setOptions={setOptions}
          isCorrect={correctAnswer === index}
          setCorrectAnswer={() => setCorrectAnswer(index)}
          type="radio"
        />
      ))}

      <button
        onClick={() =>
          setOptions([...options, { content: "", content_type: "text" }])
        }
        className="p-2 bg-green-500 text-white rounded"
      >
        Add Option
      </button>
      <button
        onClick={handleSubmit}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default MCQForm;
