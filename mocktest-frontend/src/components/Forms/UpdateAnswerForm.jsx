import { useState } from "react";
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
      await updateAnswers(questionId, correct_answers);
      onClose();
    } catch (error) {
      console.error("Error updating correct options:", error);
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow">
      {/* Question */}
      <div className="mb-3">
        <h5 className="fw-bold">Question:</h5>
        {content_type === "text" ? (
          <p className="border p-2 rounded bg-light">{content}</p>
        ) : (
          <img src={content} alt="Question" className="img-fluid rounded" />
        )}
      </div>

      {/* Options */}
      <div className="mb-3">
        <h6 className="fw-bold">Select Correct Option(s):</h6>
        {options.map((option) => (
          <div key={option.id} className="form-check">
            <input
              className="form-check-input"
              type={type === "single_choice" ? "radio" : "checkbox"}
              name="correct-option"
              checked={selectedOptions.has(option.id)}
              onChange={() => handleOptionChange(option.id)}
              id={`option-${option.id}`}
            />
            <label
              className={`form-check-label ${
                selectedOptions.has(option.id) ? "fw-bold text-success" : ""
              }`}
              htmlFor={`option-${option.id}`}
            >
              {option.content_type === "text" ? (
                option.content
              ) : (
                <img
                  src={option.content}
                  alt="Option"
                  className="img-thumbnail"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                />
              )}
            </label>
          </div>
        ))}
      </div>

      {/* Save Changes Button */}
      <button onClick={handleSaveChanges} className="btn btn-primary w-100">
        <i className="bi bi-check-circle me-2"></i> Save Correct Option
      </button>
    </div>
  );
};

export default UpdateAnswerForm;
