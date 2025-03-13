import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import { submitPassageWithQuestions } from "../../../services/questionService";

const PassageForm = ({ testId }) => {
  const [passage, setPassage] = useState({ content: "", contentType: "text" });
  const [questions, setQuestions] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("test_id", testId);
    formData.append("passage_content", passage.content);
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
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h1 className="h4 fw-bold mb-3">Passage Form</h1>

      {/* Passage Input */}
      <div className="mb-4 p-4 bg-white shadow-sm rounded">
        <button onClick={togglePassageType} className="btn btn-primary mb-2">
          Switch to {passage.contentType === "text" ? "Image" : "Text"}
        </button>
        {passage.contentType === "text" ? (
          <textarea
            className="form-control"
            value={passage.content}
            onChange={(e) =>
              setPassage({ ...passage, content: e.target.value })
            }
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
      </div>

      {/* Question Forms */}
      {questions.map((q) => (
        <QuestionForm
          key={q.id}
          question={q}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
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
      {/* Submit Button */}
      <button onClick={handleSubmit} className="btn btn-primary mt-4">
        Submit
      </button>
    </div>
  );
};

export default PassageForm;
