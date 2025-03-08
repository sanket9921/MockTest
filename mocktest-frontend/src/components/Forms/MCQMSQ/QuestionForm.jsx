import { useEffect, useState } from "react";
import QuestionInput from "../QuestionInput";
import OptionInput from "./OptionInput";

const QuestionForm = ({
  type,
  question,
  setQuestion,
  options,
  setOptions,
  correctAnswers,
  setCorrectAnswers,
}) => {
  const [errors, setErrors] = useState({});

  const handleExplanationChange = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      explanation: e.target.value,
    }));
  };

  const validateForm = () => {
    let errors = {};

    // ✅ Validate Question
    if (!question.content && question.content_type === "text") {
      errors.question = "Question text is required.";
    }
    if (question.content_type === "image" && !question.file) {
      errors.question = "Question image is required.";
    }
    if (!question.marks || question.marks <= 0) {
      errors.marks = "Marks must be greater than zero.";
    }

    // ✅ Validate Options
    if (options.length < 2) {
      errors.options = "At least two options are required.";
    }
    if (options.length > 10) {
      errors.options = "Options cannot be more than 10.";
    }
    options.forEach((opt, idx) => {
      if (!opt.content && opt.content_type === "text") {
        errors[`option${idx}`] = `Option ${idx + 1} text is required.`;
      }
      if (opt.content_type === "image" && !opt.file) {
        errors[`option${idx}`] = `Option ${idx + 1} image is required.`;
      }
    });

    // ✅ Validate Correct Answers
    if (correctAnswers.length === 0) {
      errors.correctAnswers = "At least one correct answer must be selected.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      <QuestionInput question={question} setQuestion={setQuestion} />
      {errors.question && <p className="text-red-500">{errors.question}</p>}
      {errors.marks && <p className="text-red-500">{errors.marks}</p>}

      {options.map((option, index) => (
        <div key={index}>
          <OptionInput
            index={index}
            option={option}
            options={options}
            setOptions={setOptions}
            correctAnswers={correctAnswers}
            setCorrectAnswers={setCorrectAnswers}
            type={type}
          />
          {errors[`option${index}`] && (
            <p className="text-red-500">{errors[`option${index}`]}</p>
          )}
        </div>
      ))}
      {errors.options && <p className="text-red-500">{errors.options}</p>}
      {errors.correctAnswers && (
        <p className="text-red-500">{errors.correctAnswers}</p>
      )}
      <button
        onClick={() =>
          setOptions([
            ...options,
            { content: "", content_type: "text", file: null },
          ])
        }
        className="p-2 bg-green-500 text-white rounded"
      >
        Add Option
      </button>
      <textarea
        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        value={question.explanation}
        onChange={handleExplanationChange}
        placeholder="Enter  explanation..."
      />
    </div>
  );
};

export default QuestionForm;
