import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import { submitPassageWithQuestions } from "../../../services/questionService";
import RichTextEditor from "../../common/RichTextEditor";

const PassageForm = ({ testId, refreshQuestions }) => {
  const [passage, setPassage] = useState({ content: "", contentType: "text" });
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const togglePassageType = () => {
    setPassage({
      content: "",
      contentType: passage.contentType === "text" ? "image" : "text",
    });
  };

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type,
        content: "",
        contentType: "text",
        marks: 1,
        options: [
          { content: "", contentType: "text", isCorrect: false },
          { content: "", contentType: "text", isCorrect: false },
        ],
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, updatedData) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
    );
  };

  const validateForm = () => {
    let newErrors = {};

    // Validate passage
    if (!passage.content) {
      newErrors.passage = "Passage content is required.";
    }

    // Validate questions
    let questionErrors = questions.map((q) => {
      let error = {};
      if (!q.content) {
        error.content = "Question content is required.";
      }
      if (q.options.length < 2) {
        error.options = "At least two options are required.";
      }
      if (q.options.some((opt) => !opt.content)) {
        error.optionContent = "Each option must have content.";
      }
      if (!q.options.some((opt) => opt.isCorrect)) {
        error.correctOption = "At least one correct option must be selected.";
      }
      if (!q.marks || q.marks <= 0) {
        error.marks = "Marks must be greater than 0.";
      }
      return Object.keys(error).length > 0 ? error : null;
    });

    if (questionErrors.some((e) => e !== null)) {
      newErrors.questions = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("test_id", testId);
      if (passage.contentType === "image") {
        formData.append("passageImage", passage.content);
      } else {
        formData.append("passage_content", passage.content);
      }
      formData.append("passage_content_type", passage.contentType);

      questions.forEach((q, qIndex) => {
        formData.append(`questions[${qIndex}][content]`, q.content);
        formData.append(`questions[${qIndex}][content_type]`, q.contentType);
        formData.append(`questions[${qIndex}][explanation]`, q.explanation);

        formData.append(
          `questions[${qIndex}][question_type]`,
          q.type === "MCQ" ? "single_choice" : "multiple_choice"
        );
        formData.append(`questions[${qIndex}][marks]`, q.marks);
        formData.append(`questions[${qIndex}][negativeMark]`, q.negative_marks);

        q.options.forEach((opt, optIndex) => {
          formData.append(
            `questions[${qIndex}][options][${optIndex}][content]`,
            opt.content
          );
          formData.append(
            `questions[${qIndex}][options][${optIndex}][content_type]`,
            opt.contentType
          );
        });

        const correctIndexes = q.options
          .map((opt, index) => (opt.isCorrect ? index : null))
          .filter((index) => index !== null);
        formData.append(
          `questions[${qIndex}][correct_answers]`,
          JSON.stringify(correctIndexes)
        );
      });

      await submitPassageWithQuestions(formData);

      // Reset the form after successful submission
      setPassage({ content: "", contentType: "text" });
      setQuestions([]);
      setErrors({});
      refreshQuestions(); // Refresh the list
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h1 className="h4 fw-bold mb-3">Passage Form</h1>

      {/* Passage Input */}
      <div className="mb-4 p-4 bg-white shadow-sm rounded">
        <button onClick={togglePassageType} className="btn btn-secondary mb-2">
          {passage.contentType === "text" ? "Image" : "Text"}
        </button>
        {passage.contentType === "text" ? (
          <RichTextEditor
            value={passage.content}
            onChange={(value) => setPassage({ ...passage, content: value })}
            placeholder="Enter the passage"
          />
        ) : (
          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setPassage({ ...passage, content: e.target.files[0] })
            }
          />
        )}
        {errors.passage && <p className="text-danger">{errors.passage}</p>}
      </div>

      {/* Question Forms */}
      {questions.map((q, index) => (
        <QuestionForm
          key={q.id}
          question={q}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
          errors={errors.questions && errors.questions[index]}
        />
      ))}

      {/* Buttons to Add Questions */}
      <div className="d-flex gap-3 mb-4">
        <button onClick={() => addQuestion("MCQ")} className="btn btn-success">
          Add MCQ
        </button>
        <button
          onClick={() => addQuestion("MSQ")}
          className="btn btn-secondary"
        >
          Add MSQ
        </button>
      </div>

      {/* Submit Button with Loading Spinner */}
      <button
        onClick={handleSubmit}
        className="btn btn-primary mt-4"
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default PassageForm;
