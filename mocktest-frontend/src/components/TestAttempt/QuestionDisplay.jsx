import React from "react";
import { motion } from "framer-motion";
import QuestionMCQMSQ from "./QuestionMCQMSQ";
import PassageQuestion from "./PassageQuestion";
import FillInTheBlank from "./FillInTheBlank";

const QuestionDisplay = ({
  questionData,
  userAnswer,
  onSaveAnswer,
  onClear,
}) => {
  if (!questionData) return null;

  return (
    <div className="custom-border question-container z-0">
      {/* Handle Passage-Based Questions */}
      {questionData.passage_id ? (
        <PassageQuestion
          passage={questionData}
          userAnswers={userAnswer}
          onSaveAnswer={onSaveAnswer}
          onClear={onClear}
        />
      ) : (
        // Standalone Questions
        <>
          {/* Fill in the Blank */}
          {questionData.type === "fill_in_the_blank" && (
            <FillInTheBlank
              question={questionData}
              userAnswer={userAnswer?.[questionData.id] || ""}
              onSaveAnswer={onSaveAnswer}
              onClear={onClear}
            />
          )}

          {/* MCQ (Single Choice) & MSQ (Multiple Choice) */}
          {["single_choice", "multiple_choice"].includes(questionData.type) && (
            <QuestionMCQMSQ
              question={questionData}
              userAnswer={userAnswer?.[questionData.id] || []}
              onSaveAnswer={onSaveAnswer}
              onClear={onClear}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuestionDisplay;
