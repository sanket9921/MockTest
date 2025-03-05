import React from "react";
import { motion } from "framer-motion";
import QuestionMCQMSQ from "./QuestionMCQMSQ";
import PassageQuestion from "./PassageQuestion";
import FillInTheBlank from "./FillInTheBlank";

const QuestionDisplay = ({ questionData, userAnswer, onSaveAnswer }) => {
  if (!questionData) return null;

  return (
    <motion.div
      className="flex w-3/4 p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Handle Passage-Based Questions */}
      {questionData.passage_id ? (
        <PassageQuestion
          passage={questionData}
          userAnswers={userAnswer}
          onSaveAnswer={onSaveAnswer}
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
            />
          )}

          {/* MCQ (Single Choice) & MSQ (Multiple Choice) */}
          {["single_choice", "multiple_choice"].includes(questionData.type) && (
            <QuestionMCQMSQ
              question={questionData}
              userAnswer={userAnswer?.[questionData.id] || []}
              onSaveAnswer={onSaveAnswer}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default QuestionDisplay;
