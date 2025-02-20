import { useEffect, useState } from "react";
import { submitQuestion } from "../services/questionService";
import QuestionInput from "./common/QuestionInput";

const FillBlankForm = ({
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

  const [question, setQuestion] = useState(defaultQuestion);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors, setErrors] = useState({}); // Error messages

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion({
        content: selectedQuestion.content,
        content_type: selectedQuestion.content_type,
        marks: selectedQuestion.marks,
        file: null,
      });

      setCorrectAnswer(selectedQuestion.fib_answer.correctTextAnswer || "");
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
    if (!correctAnswer) errors.correctAnswer = "Answer is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const resetForm = () => {
    setQuestion(defaultQuestion);
    setCorrectAnswer([]);
    setSelectedQuestion(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("test_id", testId);
    formData.append("question_type", "fill_in_the_blank"); // ✅ Different from MCQ
    formData.append("marks", question.marks);

    if (question.content_type === "text") {
      formData.append("content", question.content);
      formData.append("content_type", "text");
    } else if (question.content_type === "image" && question.file) {
      formData.append("questionImage", question.file);
      formData.append("content_type", "image");
    }
    formData.append("correct_answers", JSON.stringify(correctAnswer)); // ✅ Now an array

    await submitQuestion(formData);
    resetForm();
    refreshQuestions();
  };

  return (
    <div className="space-y-4">
      <QuestionInput question={question} setQuestion={setQuestion} />
      {errors.question && <p className="text-red-500">{errors.question}</p>}

      <input
        type="number"
        placeholder="Marks"
        value={question.marks}
        className="w-full p-2 border"
        onChange={(e) => setQuestion({ ...question, marks: e.target.value })}
      />
      {errors.marks && <p className="text-red-500">{errors.marks}</p>}

      <input
        type="text"
        value={correctAnswer}
        placeholder="Correct Answer"
        className="w-full p-2 border"
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      {errors.correctAnswer && (
        <p className="text-red-500">{errors.correctAnswer}</p>
      )}

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

export default FillBlankForm;
