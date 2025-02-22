import { useEffect, useState } from "react";
import OptionInput from "./OptionInput";
import { submitQuestion } from "../services/questionService";
import QuestionInput from "./common/QuestionInput";

const MCQForm = ({
  testId,
  selectedQuestion,
  setSelectedQuestion,
  refreshQuestions,
}) => {
  const defaultQuestion = {
    content: "",
    content_type: "text",
    marks: 1,
    file: null,
  };

  const defaultOptions = [
    { content: "", content_type: "text", file: null },
    { content: "", content_type: "text", file: null },
  ];

  const [question, setQuestion] = useState(defaultQuestion);
  const [options, setOptions] = useState(defaultOptions);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [errors, setErrors] = useState({}); // Error messages

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion({
        content: selectedQuestion.content,
        content_type: selectedQuestion.content_type,
        marks: selectedQuestion.marks,
        file: null,
      });

      setOptions(selectedQuestion.options || []);

      // Extract correct answers from options
      const correctOptionIds = selectedQuestion.options
        ?.filter((opt) => opt.correct_answer !== null) // ✅ Find correct options
        .map((opt) => opt.id); // ✅ Extract option IDs

      setCorrectAnswers(correctOptionIds);
    }
  }, [selectedQuestion]);

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
        formData.append("optionImages", option.file);
      }
    });

    formData.append("correct_answers", JSON.stringify(correctAnswers)); // ✅ Now an array

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
      <QuestionInput
        question={question}
        setQuestion={setQuestion}
        selectedQuestion={selectedQuestion}
      />
      {errors.question && <p className="text-red-500">{errors.question}</p>}

      {/* <input
        type="number"
        placeholder="Marks"
        className="w-full p-2 border rounded-md"
        value={question.marks}
        onChange={(e) =>
          setQuestion({ ...question, marks: parseInt(e.target.value) })
        }
      /> */}
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
            type="radio" // ✅ MSQ uses checkboxes for multiple correct answers
            selectedQuestion={selectedQuestion}
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

      <button
        onClick={handleSubmit}
        className="p-2 bg-blue-500 text-white rounded"
      >
        {selectedQuestion ? "Update" : "Submit"}
      </button>
      {selectedQuestion && (
        <button
          onClick={resetForm} // Cancel edit mode
          className="p-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default MCQForm;
