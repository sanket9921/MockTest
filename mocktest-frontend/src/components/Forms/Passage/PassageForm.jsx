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
        marks: "",
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

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await submitPassageWithQuestions(formData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Passage Form</h1>

      {/* Passage Input */}
      <div className="mb-4 p-4 bg-white shadow-md rounded">
        <button
          onClick={togglePassageType}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Switch to {passage.contentType === "text" ? "Image" : "Text"}
        </button>
        {passage.contentType === "text" ? (
          <textarea
            className="w-full p-2 border"
            value={passage.content}
            onChange={(e) =>
              setPassage({ ...passage, content: e.target.value })
            }
          />
        ) : (
          <input
            type="file"
            onChange={(e) =>
              setPassage({ ...passage, content: e.target.files[0] })
            }
          />
        )}
      </div>

      {/* Buttons to Add Questions */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => addQuestion("MCQ")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add MCQ
        </button>
        <button
          onClick={() => addQuestion("MSQ")}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Add MSQ
        </button>
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

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default PassageForm;
