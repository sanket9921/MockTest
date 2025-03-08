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
    <motion.div
      className="border p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Question Content */}
      {content_type === "image" ? (
        <img
          src={content}
          alt="Question"
          className="w-full max-w-md mx-auto rounded"
        />
      ) : (
        <h4 className="font-semibold">
          {content} <span className="text-gray-500">({marks} Marks)</span>
        </h4>
      )}

      {/* Marked for Review */}
      {markedForReview && (
        <p className="text-yellow-500 font-semibold">⚠ Marked for Review</p>
      )}

      {/* Fill in the Blank Question Handling */}
      {type === "fill_in_the_blank" && fib_answer ? (
        <div className="mt-3">
          {userAnswer === fib_answer.correctTextAnswer.replace(/"/g, "") ? (
            <p className="p-2 rounded bg-green-200">{userAnswer}</p>
          ) : (
            <>
              <p className="p-2 rounded bg-red-200">
                Your Answer: {userAnswer}
              </p>
              <p className="p-2 rounded bg-green-200">
                Correct Answer: {fib_answer.correctTextAnswer.replace(/"/g, "")}
              </p>
            </>
          )}
        </div>
      ) : (
        /* Multiple Choice / Single Choice Question Handling */
        <div className="mt-3 space-y-2">
          {options.map((option) => {
            const isCorrect = option.correct_answer !== null;
            const isUserSelected = userAnswer?.includes(option.id);
            const isIncorrect = isUserSelected && !isCorrect;

            return (
              <motion.div
                key={option.id}
                className={`p-2 rounded ${
                  isCorrect
                    ? "bg-green-200"
                    : isIncorrect
                    ? "bg-red-200"
                    : "bg-gray-100"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {option.content}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <p className="mt-3 text-gray-700">
          <strong>Explanation:</strong> {explanation}
        </p>
      )}
    </motion.div>
  );
};

export default QuestionCard;
