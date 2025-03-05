import React from "react";

const QuestionMCQMSQ = ({ question, onSaveAnswer }) => {
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
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* Question Text or Image */}
      <div className="mb-4 text-lg font-semibold">
        {question.content_type === "text" ? (
          <p>{question.content}</p>
        ) : (
          <img src={question.content} alt="Question" className="rounded-lg" />
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {/* Radio Button for MCQ, Checkbox for MSQ */}
            {question.type === "single_choice" ? (
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={question.userAnswer?.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                className="form-radio text-blue-600"
              />
            ) : (
              <input
                type="checkbox"
                value={option.id}
                checked={question.userAnswer?.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                className="form-checkbox text-blue-600"
              />
            )}

            {/* Option Text or Image */}
            {option.content_type === "text" ? (
              <span>{option.content}</span>
            ) : (
              <img
                src={option.content}
                alt="Option"
                className="h-10 w-10 object-cover rounded"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionMCQMSQ;
