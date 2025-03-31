import { motion } from "framer-motion";

const QuestionCard = ({ question, negative_marks }) => {
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

  const isUnattempted =
    !userAnswer ||
    (Array.isArray(userAnswer) && userAnswer.length === 0) ||
    (type === "fill_in_the_blank" &&
      (typeof userAnswer !== "string" || userAnswer.trim() === "")); // Ensure userAnswer is a string before calling trim

  const correctOptionIds = options
    .filter((option) => option.correct_answer !== null)
    .map((option) => option.id);

  const isCorrect =
    !isUnattempted &&
    (type === "fill_in_the_blank"
      ? typeof userAnswer === "string" &&
        userAnswer.trim() === fib_answer.replace(/"/g, "").trim() // Ensure userAnswer is a string before using trim
      : Array.isArray(userAnswer) &&
        userAnswer.length === correctOptionIds.length &&
        correctOptionIds.every((id) => userAnswer.includes(id)));

  const isIncorrect = !isCorrect && !isUnattempted;

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      {/* Question Content */}
      {content_type === "image" ? (
        <img
          src={content}
          alt="Question"
          className=" img-fluid rounded d-block p-2"
          // style={{ maxWidth: "400px" }}
        />
      ) : (
        <p className="mt-2" dangerouslySetInnerHTML={{ __html: content }} />
      )}

      {/* Marked for Review */}
      {markedForReview && (
        <p className="text-warning fw-semibold mt-2">⚠ Marked for Review</p>
      )}
      {isUnattempted ? (
        <span className="text-muted fw-bold">➖ 0 Marks</span>
      ) : isCorrect ? (
        <span className="text-success fw-bold">✔ +{marks} Marks</span>
      ) : (
        <span className="text-danger fw-bold">
          ✖ -{negative_marks || 0} Marks
        </span>
      )}

      {/* Fill in the Blank Question Handling */}
      {type === "fill_in_the_blank" && fib_answer ? (
        <div className="mt-3">
          {userAnswer === fib_answer.replace(/"/g, "") ? (
            <p className="p-2 rounded bg-success text-white">{userAnswer}</p>
          ) : (
            <>
              <p className="p-2 rounded bg-danger text-white">
                Your Answer: {userAnswer}
              </p>
              <p className="p-2 rounded bg-success text-white">
                Correct Answer: {fib_answer.replace(/"/g, "")}
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
                className="p-2 custom-border my-1 rounded"
                style={{
                  backgroundColor: isCorrect
                    ? "#90EE90" // Light Green for Correct
                    : isIncorrect
                    ? "#ff9999" // Light Red for Incorrect
                    : "#f8f9fa", // Default Bootstrap Light Gray
                  color: isCorrect || isIncorrect ? "black" : "black", // Ensures text is readable
                }}
              >
                {option.content_type === "image" ? (
                  <img
                    src={option.content}
                    alt="Option"
                    className="rounded d-block p-2"
                    style={{ maxWidth: "250px" }}
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: option.content }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <span>
          <strong>Explanation:</strong>
          <p
            className="text-muted"
            dangerouslySetInnerHTML={{ __html: explanation }}
          />
        </span>
      )}
    </div>
  );
};

export default QuestionCard;
