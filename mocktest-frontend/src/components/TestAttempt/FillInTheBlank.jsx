import React from "react";

const FillInTheBlank = ({ question, onSaveAnswer, onClear }) => {
  return (
    <div className="mt-3 z-0 w-100">
      <p
        className="w-100"
        dangerouslySetInnerHTML={{ __html: question?.content }}
      />
      <input
        type="text"
        className="form-control w-100 mb-2"
        placeholder="Enter your answer"
        value={question.userAnswer || ""}
        onChange={(e) => onSaveAnswer(question.id, e.target.value)}
      />
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onClear(question.id)}
      >
        Clear
      </button>
    </div>
  );
};

export default FillInTheBlank;
