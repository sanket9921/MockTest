import React from "react";

const QuestionNavigator = ({ questions, currentQuestionIndex, onNavigate }) => {
  const getButtonColor = (question, index) => {
    let bgColor = "bg-secondary"; // Default: Unanswered (Gray)

    if (question.passage_id) {
      // If it's a passage-based question, check all related questions
      const allAnswered = question.questions.every(
        (q) => q.userAnswer?.length > 0
      );
      const isMarkedForReview = question.questions.some(
        (q) => q.markedForReview
      );

      if (isMarkedForReview) bgColor = "bg-purple"; // Purple for review
      else if (allAnswered) bgColor = "bg-success"; // Green if all are answered
      else bgColor = "bg-warning"; // Yellow if some are unanswered
    } else {
      // Single standalone question
      if (question.markedForReview) bgColor = "bg-purple"; // Purple for review
      else if (question.userAnswer?.length > 0)
        bgColor = "bg-success"; // Green if answered
      else bgColor = "bg-secondary"; // Gray if unanswered
    }

    // Highlight the current question in Blue
    if (currentQuestionIndex === index) bgColor = "bg-primary text-white";

    return bgColor;
  };

  return (
    <div className="bg-light rounded h-100 d-flex flex-column px-md-2 px-lg-2">
      <h3 className="m-2">Question</h3>

      {/* For Large Screens (Grid Layout) */}
      <div
        className="d-none d-md-grid gap-2"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`btn ${getButtonColor(
              question,
              index
            )} text-white d-flex align-items-center justify-content-center`}
            style={{
              width: "50px",
              height: "50px",
              aspectRatio: "1/1",
              borderRadius: "50%",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* For Small Screens (Horizontal Scroll) */}
      <div className="d-md-none d-flex overflow-auto gap-2 py-2 flex-nowrap">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`btn ${getButtonColor(
              question,
              index
            )} text-white d-flex align-items-center justify-content-center`}
            style={{
              width: "40px",
              height: "40px",
              aspectRatio: "1/1",
              borderRadius: "50%",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;
