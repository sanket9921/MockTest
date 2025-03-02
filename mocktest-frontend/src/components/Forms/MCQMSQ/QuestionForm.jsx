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

  const resetForm = () => {
    setQuestion(defaultQuestion);
    setOptions(defaultOptions);
    setCorrectAnswers([]);
    setSelectedQuestion(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("test_id", testId);
    formData.append("question_type", "single_choice"); // ✅ Different from MCQ
    formData.append("marks", question.marks);

    if (question.content_type === "text") {
      formData.append("content", question.content);
      formData.append("content_type", "text");
    } else if (question.content_type === "image" && question.file) {
      formData.append("questionImage", question.file);
      formData.append("content_type", "image");
    }

    options.forEach((option, index) => {
      if (option.content_type === "text") {
        formData.append(`options[${index}][content]`, option.content);
        formData.append(`options[${index}][content_type]`, "text");
      } else if (option.content_type === "image" && option.file) {
        formData.append(`options[${index}][content]`, "");
        formData.append(`options[${index}][content_type]`, "image");
        formData.append(`optionImages[${index}]`, option.file);
      }
    });

    formData.append("correct_answers", JSON.stringify(correctAnswers));

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    if (selectedQuestion) {
      console.log(formData);
    } else await submitQuestion(formData);

    resetForm();
    refreshQuestions();
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
            correctAnswers={correctAnswers} // ✅ Now passing an array
            setCorrectAnswers={setCorrectAnswers} // ✅ Pass the setter function
            type={type} // ✅ MSQ uses checkboxes for multiple correct answers
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
    </div>
  );
};

export default QuestionForm;
