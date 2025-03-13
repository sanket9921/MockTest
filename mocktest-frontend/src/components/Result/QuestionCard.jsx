import { motion } from "framer-motion";

const QuestionCard = ({ question }) => {
  const {
    content,
    content_type,
    options,
    userAnswer,
    type,
    marks,
    explanation,
    markedForReview,
    fib_answer,
  } = question;

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      {/* Question Content */}
      {content_type === "image" ? (
        <img
          src={content}
          alt="Question"
          className="w-100 rounded d-block mx-auto"
          style={{ maxWidth: "400px" }}
        />
      ) : (
        <h4 className="fw-semibold">
          {content} <span className="text-muted">({marks} Marks)</span>
        </h4>
      )}

      {/* Marked for Review */}
      {markedForReview && (
        <p className="text-warning fw-semibold mt-2">⚠ Marked for Review</p>
      )}

      {/* Fill in the Blank Question Handling */}
      {type === "fill_in_the_blank" && fib_answer ? (
        <div className="mt-3">
          {userAnswer === fib_answer.correctTextAnswer.replace(/"/g, "") ? (
            <p className="p-2 rounded bg-success text-white">{userAnswer}</p>
          ) : (
            <>
              <p className="p-2 rounded bg-danger text-white">
                Your Answer: {userAnswer}
              </p>
              <p className="p-2 rounded bg-success text-white">
                Correct Answer: {fib_answer.correctTextAnswer.replace(/"/g, "")}
              </p>
            </>
          )}
        </div>
      ) : (
        /* Multiple Choice / Single Choice Question Handling */
        <div className="mt-3">
          {options.map((option) => {
            const isCorrect = option.correct_answer !== null;
            const isUserSelected = userAnswer?.includes(option.id);
            const isIncorrect = isUserSelected && !isCorrect;

            return (
              <div
                key={option.id}
                className={`p-2 rounded ${
                  isCorrect
                    ? "bg-success text-white"
                    : isIncorrect
                    ? "bg-danger text-white"
                    : "bg-light"
                }`}
              >
                {option.content}
              </div>
            );
          })}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <p className="mt-3 text-muted">
          <strong>Explanation:</strong> {explanation}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
