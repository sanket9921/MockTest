import { useState } from "react";
import axios from "axios";
import { updateAnswers } from "../../services/answersService";

const UpdateAnswerForm = ({ data, onClose }) => {
  const { id: questionId, content, content_type, type, options } = data;

  // Extract correct answers
  const correctAnswers = new Set(
    options.filter((opt) => opt.correct_answer).map((opt) => opt.id)
  );

  const [selectedOptions, setSelectedOptions] = useState(
    new Set(correctAnswers)
  );

  // Handle selection change
  const handleOptionChange = (optionId) => {
    if (type === "single_choice") {
      setSelectedOptions(new Set([optionId])); // Only one correct option for MCQ
    } else {
      // Toggle selection for MSQ
      setSelectedOptions((prev) => {
        const newSet = new Set(prev);
        newSet.has(optionId) ? newSet.delete(optionId) : newSet.add(optionId);
        return newSet;
      });
    }
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    try {
      const correct_answers = Array.from(selectedOptions);
      // await axios.post("/api/questions/update-correct-option", payload);
      await updateAnswers(questionId, correct_answers);
      // alert("Correct options updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating correct options:", error);
      // alert("Failed to update options.");
    }
  };

  return (
    <div>
      {/* Question */}
      <div className="mb-4 text-lg font-semibold">
        {content_type === "text" ? (
          <p>{content}</p>
        ) : (
          <img
            src={content}
            alt="Question"
            className="w-full h-40 object-contain"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
              selectedOptions.has(option.id) ? "bg-green-100" : ""
            }`}
          >
            <input
              type={type === "single_choice" ? "radio" : "checkbox"}
              name="correct-option"
              checked={selectedOptions.has(option.id)}
              onChange={() => handleOptionChange(option.id)}
              className="accent-blue-500"
            />
            {option.content_type === "text" ? (
              <span>{option.content}</span>
            ) : (
              <img
                src={option.content}
                alt="Option"
                className="w-10 h-10 object-contain"
              />
            )}
          </label>
        ))}
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSaveChanges}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Save Correct Option
      </button>
    </div>
  );
};

export default UpdateAnswerForm;
