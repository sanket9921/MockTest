import React from "react";

const QuestionNavigator = ({ questions, currentQuestionIndex, onNavigate }) => {
  return (
    <div className="p-3 bg-light rounded h-100 d-flex flex-column">
      <h1 className="mb-3">Question</h1>

      {/* For Large Screens (Grid Layout) */}
      <div
        className="d-none d-md-grid gap-2"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          justifyContent: "start",
          alignItems: "start", // Aligns rows properly
        }}
      >
        {questions.map((question, index) => {
          let bgColor = "bg-secondary"; // Default: Unanswered

          if (question.markedForReview) bgColor = "bg-warning";
          else if (question.userAnswer?.length > 0) bgColor = "bg-success";
          if (currentQuestionIndex === index) bgColor = "bg-primary text-white";

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`btn ${bgColor} text-white d-flex align-items-center justify-content-center`}
              style={{
                width: "40px",
                height: "40px",
                aspectRatio: "1/1",
                borderRadius: "50%",
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* For Small Screens (Horizontal Scroll) */}
      <div className="d-md-none d-flex overflow-auto gap-2 py-2 flex-nowrap">
        {questions.map((question, index) => {
          let bgColor = "bg-secondary"; // Default: Unanswered

          if (question.markedForReview) bgColor = "bg-warning";
          else if (question.userAnswer?.length > 0) bgColor = "bg-success";
          if (currentQuestionIndex === index) bgColor = "bg-primary text-white";

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`btn ${bgColor} text-white d-flex align-items-center justify-content-center`}
              style={{
                width: "40px",
                height: "40px",
                aspectRatio: "1/1",
                borderRadius: "50%",
              }}
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
