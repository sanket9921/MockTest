import React from "react";

const FillInTheBlank = ({ question, onSaveAnswer }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {question.content}
      </h2>
      <input
        type="text"
        className="w-full p-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300"
        placeholder="Enter your answer"
        value={question.userAnswer || ""}
        onChange={(e) => onSaveAnswer(question.id, e.target.value)}
      />
    </div>
  );
};

export default FillInTheBlank;
