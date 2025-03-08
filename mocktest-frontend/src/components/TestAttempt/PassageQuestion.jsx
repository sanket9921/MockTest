import React from "react";
import QuestionMCQMSQ from "./QuestionMCQMSQ";
import FillInTheBlank from "./FillInTheBlank";

const PassageQuestion = ({ passage, userAnswers, onSaveAnswer, onClear }) => {
  if (!passage) return null;

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      {/* Passage Section */}
      <div className="mb-4 p-4 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-blue-600">Passage</h3>
        {passage.content_type === "text" ? (
          <p className="mt-2 text-gray-700">{passage.content}</p>
        ) : (
          <img
            src={passage.content}
            alt="Passage"
            className="mt-2 rounded-lg"
          />
        )}
      </div>

      {/* Questions Under the Passage */}
      <div className="space-y-6">
        {passage.questions?.map((question) => (
          <div
            key={question.id}
            className="p-4 border border-gray-200 rounded-lg"
          >
            {/* Fill in the Blank */}
            {question.type === "fill_in_the_blank" ? (
              <FillInTheBlank
                question={question}
                userAnswer={userAnswers?.[question.id] || ""}
                onSaveAnswer={onSaveAnswer}
                onClear={onClear}
              />
            ) : (
              <QuestionMCQMSQ
                question={question}
                userAnswer={userAnswers?.[question.id] || []}
                onSaveAnswer={onSaveAnswer}
                onClear={onClear}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassageQuestion;
