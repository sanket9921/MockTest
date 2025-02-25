import { motion } from "framer-motion";

const QuestionCard = ({ question, selectedAnswer, onAnswerChange }) => {
  const handleCheckboxChange = (optionId) => {
    let updatedAnswers = selectedAnswer ? [...selectedAnswer] : [];

    if (updatedAnswers.includes(optionId)) {
      updatedAnswers = updatedAnswers.filter((id) => id !== optionId); // Unselect
    } else {
      updatedAnswers.push(optionId); // Select
    }

    console.log(updatedAnswers);
    onAnswerChange(updatedAnswers);
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Question Content */}
      <h2 className="text-lg font-semibold text-gray-800">
        {question.content}
      </h2>

      {/* Options for single_choice & multiple_choice */}
      {question.type !== "fill_in_the_blank" && (
        <div className="mt-4">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="block p-2 border rounded flex items-center gap-2 cursor-pointer hover:bg-blue-100"
            >
              <input
                type={question.type === "single_choice" ? "radio" : "checkbox"}
                name={`question-${question.id}`}
                checked={
                  question.type === "single_choice"
                    ? selectedAnswer === option.id
                    : selectedAnswer?.includes(option.id)
                }
                onChange={() =>
                  question.type === "single_choice"
                    ? onAnswerChange(option.id)
                    : handleCheckboxChange(option.id)
                }
                className="form-checkbox text-blue-500"
              />
              {option.content}
            </label>
          ))}
        </div>
      )}

      {/* Input for fill-in-the-blank */}
      {question.type === "fill_in_the_blank" && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your answer..."
            value={selectedAnswer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
