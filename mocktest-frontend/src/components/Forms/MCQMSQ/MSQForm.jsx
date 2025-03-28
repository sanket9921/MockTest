import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { submitQuestion } from "../../../services/questionService";

const MCQForm = ({ data, testId, refreshQuestions }) => {
  const defaultQuestion = {
    content: "",
    content_type: "text",
    marks: 1,
    explanation: "",
    file: null,
  };

  const generateDefaultOptions = () => [
    { id: Date.now() + 1, content: "", content_type: "text", file: null },
    { id: Date.now() + 2, content: "", content_type: "text", file: null },
  ];

  const [question, setQuestion] = useState(defaultQuestion);
  const [options, setOptions] = useState(generateDefaultOptions());
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now()); // 🔹 Force RichTextEditor Reset

  const validateForm = () => {
    let newErrors = {};

    if (!question.content?.trim()) {
      newErrors.question = "Question content is required.";
    }

    if (options.length < 2) {
      newErrors.options = "At least two options are required.";
    }

    options.forEach((option, index) => {
      if (!option.content?.trim() && !option.file) {
        newErrors[`option${index}`] = `Option ${index + 1} cannot be empty.`;
      }
    });

    if (correctAnswers.length === 0) {
      newErrors.correctAnswers =
        "At least one correct answer must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("test_id", testId ? testId : data.questions[0].test_id);
      formData.append("passage_id", data?.passage_id ? data.passage_id : "");
      formData.append("question_type", "multiple_choice");
      formData.append("marks", question.marks);
      formData.append("explanation", question.explanation);

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

      await submitQuestion(formData);
      refreshQuestions();

      // Reset form
      setQuestion({ ...defaultQuestion });
      setOptions(generateDefaultOptions());
      setCorrectAnswers([]);
      setErrors({});
      setEditorKey(Date.now()); // 🔹 Force RichTextEditor to Reset
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <QuestionForm
        key={editorKey} // 🔹 Force re-render when reset
        type={"checkbox"}
        question={question}
        setQuestion={setQuestion}
        options={options}
        setOptions={setOptions}
        correctAnswers={correctAnswers}
        setCorrectAnswers={setCorrectAnswers}
        errors={errors}
      />

      {errors.options && <p className="text-danger">{errors.options}</p>}
      {errors.correctAnswers && (
        <p className="text-danger">{errors.correctAnswers}</p>
      )}

      {/* Submit Button with Loading Spinner */}
      <button
        onClick={handleSubmit}
        className="mt-4 btn btn-primary text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Submitting...
          </>
        ) : (
          "Save Question"
        )}
      </button>
    </>
  );
};

export default MCQForm;
