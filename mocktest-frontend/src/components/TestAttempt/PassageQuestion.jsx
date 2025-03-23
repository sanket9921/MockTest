import React from "react";
import QuestionMCQMSQ from "./QuestionMCQMSQ";
import FillInTheBlank from "./FillInTheBlank";

const PassageQuestion = ({ passage, userAnswers, onSaveAnswer, onClear }) => {
  if (!passage) return null;

  return (
    <div className="w-100 bg-white z-0 rounded">
      {/* Passage Section */}
      <div className="mb-4 border-bottom">
        {passage.content_type === "text" ? (
          <p
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: passage.content }}
          />
        ) : (
          <img
            src={passage.content}
            alt="Passage"
            className="mt-2 rounded img-fluid w-100"
          />
        )}
      </div>

      {/* Questions Under the Passage */}
      <div className="d-flex flex-column gap-2 w-100">
        {passage.questions?.map((question) => (
          <div key={question.id} className="p-3 border rounded w-100">
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
