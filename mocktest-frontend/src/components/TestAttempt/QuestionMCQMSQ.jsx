import React from "react";

const QuestionMCQMSQ = ({ question, onSaveAnswer, onClear }) => {
  if (!question) return null;

  const handleOptionChange = (optionId) => {
    if (question.type === "single_choice") {
      onSaveAnswer(question.id, optionId);
    } else if (question.type === "multiple_choice") {
      const updatedAnswers = question.userAnswer
        ? [...question.userAnswer]
        : [];
      if (updatedAnswers.includes(optionId)) {
        onSaveAnswer(
          question.id,
          updatedAnswers.filter((id) => id !== optionId)
        );
      } else {
        onSaveAnswer(question.id, [...updatedAnswers, optionId]);
      }
    }
  };

  return (
    <div className="w-100 py-4">
      {/* Question Text or Image */}
      <div className="w-100 mb-3">
        {question.content_type === "text" ? (
          <p
            className="w-100"
            dangerouslySetInnerHTML={{ __html: question?.content }}
          />
        ) : (
          <img
            src={question.content}
            alt="Question"
            className="img-fluid rounded-lg w-100"
          />
        )}
      </div>

      {/* Options - Full Width */}
      <div className="d-flex flex-column gap-2 w-100">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="d-flex align-items-center border p-3 w-100 rounded"
            style={{ cursor: "pointer" }}
          >
            {/* Radio Button for MCQ, Checkbox for MSQ */}
            {question.type === "single_choice" ? (
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={question.userAnswer?.includes(option.id) || ""}
                onChange={() => handleOptionChange(option.id)}
                className="form-check-input me-2"
              />
            ) : (
              <input
                type="checkbox"
                value={option.id}
                checked={question.userAnswer?.includes(option.id) || ""}
                onChange={() => handleOptionChange(option.id)}
                className="form-check-input me-2"
              />
            )}

            {/* Option Text or Image */}
            <div className="flex-grow-1">
              {option.content_type === "text" ? (
                <span className="w-100">{option.content}</span>
              ) : (
                <img
                  src={option.content}
                  alt="Option"
                  className="img-fluid w-100"
                  style={{ maxHeight: "50px", objectFit: "contain" }}
                />
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Clear Button */}
      <button
        onClick={() => onClear(question.id)}
        className="btn btn-secondary btn-sm mt-3"
      >
        Clear
      </button>
    </div>
  );
};

export default QuestionMCQMSQ;
