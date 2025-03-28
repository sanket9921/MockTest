import { useEffect, useState } from "react";
import QuestionInput from "./QuestionInput";
import { submitQuestion } from "../../services/questionService";
import RichTextEditor from "../common/RichTextEditor";

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
    negative_marks: 0,
    explanation: "",
    file: null,
  };

  const [question, setQuestion] = useState(defaultQuestion);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 🔹 Loading State
  const [editorKey, setEditorKey] = useState(Date.now()); // 🔹 Reset RichTextEditor

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion({
        content: selectedQuestion.content,
        content_type: selectedQuestion.content_type,
        marks: selectedQuestion.marks,
        explanation: selectedQuestion.explanation || "",
        file: null,
      });

      setCorrectAnswer(selectedQuestion.fib_answer.correctTextAnswer || "");
    }
  }, [selectedQuestion]);

  const validateForm = () => {
    let errors = {};

    if (!question.content.trim() && question.content_type === "text") {
      errors.question = "Question text is required.";
    }
    if (question.content_type === "image" && !question.file) {
      errors.question = "Question image is required.";
    }
    if (!question.marks || question.marks <= 0) {
      errors.marks = "Marks must be greater than zero.";
    }
    if (!correctAnswer.trim()) {
      errors.correctAnswer = "Answer is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setQuestion({ ...defaultQuestion });
    setCorrectAnswer("");
    setSelectedQuestion(null);
    setEditorKey(Date.now()); // 🔹 Force RichTextEditor Reset
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true); // 🔹 Start Loader

    try {
      const formData = new FormData();
      formData.append("test_id", testId);
      formData.append("question_type", "fill_in_the_blank");
      formData.append("marks", question.marks);
      formData.append("negativeMark", question.negative_marks);
      formData.append("explanation", question.explanation);

      if (question.content_type === "text") {
        formData.append("content", question.content);
        formData.append("content_type", "text");
      } else if (question.content_type === "image" && question.file) {
        formData.append("questionImage", question.file);
        formData.append("content_type", "image");
      }
      formData.append("correct_answers", JSON.stringify(correctAnswer));

      await submitQuestion(formData);
      refreshQuestions();
      resetForm();
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setLoading(false); // 🔹 Stop Loader
    }
  };

  return (
    <div className="container p-3">
      <div className="mb-3">
        <QuestionInput question={question} setQuestion={setQuestion} />
        {errors.question && (
          <div className="text-danger small mt-1">{errors.question}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Correct Answer</label>
        <input
          type="text"
          value={correctAnswer}
          className="form-control"
          placeholder="Enter correct answer"
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
        {errors.correctAnswer && (
          <div className="text-danger small mt-1">{errors.correctAnswer}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Explanation</label>
        <RichTextEditor
          key={editorKey} // 🔹 Reset RichTextEditor when form resets
          value={question.explanation}
          onChange={(value) =>
            setQuestion((prevQuestion) => ({
              ...prevQuestion,
              explanation: value,
            }))
          }
          placeholder="Enter explanation..."
        />
      </div>

      <div className="d-flex gap-2">
        {/* Submit Button with Loader */}
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {selectedQuestion ? "Updating..." : "Submitting..."}
            </>
          ) : selectedQuestion ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>

        {selectedQuestion && (
          <button onClick={resetForm} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default FillBlankForm;
