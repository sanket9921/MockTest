import React from "react";

const QuestionNavigator = ({ questions, currentQuestionIndex, onNavigate }) => {
  // Create a map to track passage-based question status
  const passageStatus = {};
  questions.forEach((q) => {
    if (q.passage_id) {
      if (!passageStatus[q.passage_id]) {
        passageStatus[q.passage_id] = { total: 0, answered: 0, marked: false };
      }
      passageStatus[q.passage_id].total = q.questions.length;

      q?.questions.forEach((pq) => {
        if (pq.userAnswer && pq.userAnswer.length > 0) {
          passageStatus[q.passage_id].answered += 1;
        }
      });

      if (q.questions[0]?.markedForReview) {
        passageStatus[q.passage_id].marked = true;
      }
    }
  });
  return (
    <div className="w-1/4 p-4 bg-gray-100 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          let bgColor = "bg-gray-400"; // Default: Unanswered

          if (question.passage_id) {
            // Get passage status
            const passage = passageStatus[question.passage_id];

            if (passage.marked) {
              bgColor = "bg-purple-500"; // If any question in the passage is marked for review
            } else if (passage.answered === passage.total) {
              bgColor = "bg-green-500"; // All answered ✅
            } else if (passage.answered > 0) {
              bgColor = "bg-yellow-500"; // Partially answered 🟡
            }
          } else {
            // Individual question logic
            if (question.markedForReview) {
              bgColor = "bg-purple-500"; // Marked for Review 🟣
            } else if (question.userAnswer && question.userAnswer.length > 0) {
              bgColor = "bg-green-500"; // Answered ✅
            }
          }

          // Highlight current question
          if (currentQuestionIndex === index) {
            bgColor = "bg-blue-500 ring-2 ring-blue-600";
          }

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-full transition-all duration-200 ${bgColor}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
