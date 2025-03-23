import React from "react";
import RichTextEditor from "../../common/RichTextEditor";

const QuestionForm = ({ question, updateQuestion, removeQuestion }) => {
  const toggleQuestionType = () => {
    updateQuestion(question.id, {
      contentType: question.contentType === "text" ? "image" : "text",
    });
  };

  const updateOption = (index, value) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === index ? { ...opt, content: value } : opt
    );
    updateQuestion(question.id, { options: updatedOptions });
  };

  const toggleCorrectAnswer = (index) => {
    const updatedOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect:
        question.type === "MCQ"
          ? i === index
          : i === index
          ? !opt.isCorrect
          : opt.isCorrect,
    }));
    updateQuestion(question.id, { options: updatedOptions });
  };

  const addOption = () => {
    updateQuestion(question.id, {
      options: [
        ...question.options,
        { content: "", contentType: "text", isCorrect: false },
      ],
    });
  };

  const removeOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: updatedOptions });
  };

  return (
    <div className="p-3 bg-white shadow-sm rounded mb-3 border">
      {/* Toggle Question Type */}
      <button
        onClick={toggleQuestionType}
        className="btn btn-secondary mb-2 d-flex align-items-center"
      >
        {question.contentType === "text" ? "Image" : "Text"}
      </button>

      {/* Question Input */}
      {question.contentType === "text" ? (
        <RichTextEditor
          value={question.content}
          onChange={(value) => updateQuestion(question.id, { content: value })}
          placeholder="Enter the Question"
        />
      ) : (
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) =>
            updateQuestion(question.id, { content: e.target.files[0] })
          }
        />
      )}

      {/* Marks Input */}
      <label className="form-label mt-2">Marks</label>
      <input
        className="form-control mb-2"
        type="number"
        placeholder="Marks"
        value={question.marks}
        onChange={(e) => updateQuestion(question.id, { marks: e.target.value })}
      />

      {/* Options Section */}
      {question.options.map((opt, index) => (
        <div key={index} className="d-flex align-items-center gap-2 mb-2">
          <input
            type={question.type === "MCQ" ? "radio" : "checkbox"}
            checked={opt.isCorrect}
            onChange={() => toggleCorrectAnswer(index)}
            className="form-check-input"
          />

          {/* Option Input (Using RichTextEditor) */}
          <RichTextEditor
            value={opt.content}
            onChange={(value) => updateOption(index, value)}
            placeholder="Enter option content"
          />

          {/* Remove Option Button */}
          <div
            className="text-danger text-bold"
            onClick={() => removeOption(index)}
            role="button"
          >
            <i className="bi bi-x-lg"></i>
          </div>
        </div>
      ))}

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="btn btn-success d-flex align-items-center mb-2"
      >
        <i className="bi bi-plus-circle me-2"></i> Add Option
      </button>

      {/* Explanation Input (Using RichTextEditor) */}
      <label className="form-label">Explanation</label>
      <RichTextEditor
        value={question.explanation}
        onChange={(value) =>
          updateQuestion(question.id, { explanation: value })
        }
        placeholder="Enter explanation..."
      />

      {/* Remove Question Button */}
      <button
        onClick={() => removeQuestion(question.id)}
        className="btn btn-danger d-flex align-items-center mt-2"
      >
        <i className="bi bi-trash me-2"></i> Remove Question
      </button>
    </div>
  );
};

export default QuestionForm;
